package com.teamdev.filehub.processes.filesystem.remove;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.filestorage.FileStorage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

class FolderRemoveProcessTest {

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void nullTest() {

        var tester = new NullPointerTester();
        tester.setDefault(FileStorage.class, Mockito.mock(FileStorage.class));
        tester.testAllPublicConstructors(FolderRemoveProcess.class);

    }

    @Test
    @DisplayName("Should call remove folder with content and return removed folder id")
    void testHandleWithoutExceptions() throws DataNotFoundException, AccessDeniedException {

        var userId = new RecordId("userId");

        var folderRecord = new FolderRecord(
                new RecordId("folderId"),
                userId,
                new RecordId("folderId"),
                "name"
        );

        var innerFolderRecord = new FolderRecord(
                new RecordId("innerFolderId"),
                userId,
                folderRecord.id(),
                "name"
        );

        var fileRecord1 = new FileRecord(
                new RecordId("fileRecord1"),
                folderRecord.id(),
                userId,
                "name",
                "mimetype",
                123,
                120,
                "ext");

        var fileRecord2 = new FileRecord(
                new RecordId("fileRecord2"),
                innerFolderRecord.id(),
                userId,
                "name",
                "mimetype",
                123,
                120,
                "ext");

        var fileDao = Mockito.mock(FileDao.class);
        Mockito.when(fileDao.getByFolderId(folderRecord.id()))
               .thenReturn(List.of(fileRecord1));
        Mockito.when(fileDao.getByFolderId(innerFolderRecord.id()))
               .thenReturn(List.of(fileRecord2));

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderRecord.id()))
               .thenReturn(Optional.of(folderRecord));
        Mockito.when(folderDao.getByParentId(folderRecord.id()))
               .thenReturn(List.of(innerFolderRecord));
        Mockito.when(folderDao.getByParentId(innerFolderRecord.id()))
               .thenReturn(List.of());

        var fileStorage = Mockito.mock(FileStorage.class);

        var process = new FolderRemoveProcess(folderDao, fileDao, fileStorage);

        var command = new RemoveCommand(folderRecord.ownerId(),
                                        folderRecord.id());

        assertThat(process.handle(command))
                .isEqualTo(folderRecord.id());

        Mockito.verify(folderDao, Mockito.times(1))
               .delete(folderRecord.id());
        Mockito.verify(folderDao, Mockito.times(1))
               .delete(innerFolderRecord.id());

        Mockito.verify(fileDao, Mockito.times(1))
               .delete(fileRecord1.id());
        Mockito.verify(fileDao, Mockito.times(1))
               .delete(fileRecord2.id());

        Mockito.verify(fileStorage, Mockito.times(1))
               .removeFile(fileRecord1.id());
        Mockito.verify(fileStorage, Mockito.times(1))
               .removeFile(fileRecord2.id());

    }

    @Test
    @DisplayName("Should throw DataNotFoundException because folder doesn't exist")
    void testHandleWithDataNotFoundException() {

        var folderId = new RecordId("folderId");

        var fileDao = Mockito.mock(FileDao.class);

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderId))
               .thenReturn(Optional.empty());

        var fileStorage = Mockito.mock(FileStorage.class);

        var process = new FolderRemoveProcess(folderDao, fileDao, fileStorage);

        var command = new RemoveCommand(new RecordId("userid"),
                                        folderId);

        assertThrows(DataNotFoundException.class, () -> {
            process.handle(command);
        });

        Mockito.verify(folderDao, Mockito.never())
               .delete(any());

        Mockito.verify(fileStorage, Mockito.never())
               .removeFile(any());

    }

    @Test
    @DisplayName("Should throw AccessDeniedException because user not owner")
    void testHandleWithAccessDeniedException() {

        var folderRecord = new FolderRecord(
                new RecordId("folderId"),
                new RecordId("userId"),
                new RecordId("folderId"),
                "name"
        );

        var fileDao = Mockito.mock(FileDao.class);

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderRecord.id()))
               .thenReturn(Optional.of(folderRecord));

        var fileStorage = Mockito.mock(FileStorage.class);

        var process = new FolderRemoveProcess(folderDao, fileDao, fileStorage);

        var command = new RemoveCommand(new RecordId("notOwnerUserId"),
                                        folderRecord.id());

        assertThrows(AccessDeniedException.class, () -> {
            process.handle(command);
        });

        Mockito.verify(folderDao, Mockito.never())
               .delete(any());

        Mockito.verify(fileStorage, Mockito.never())
               .removeFile(any());

    }

}

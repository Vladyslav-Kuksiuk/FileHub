package com.teamdev.filehub.processes.filesystem.remove;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.filestorage.FileStorage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

class FileRemoveProcessTest {

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void nullTest() {

        var tester = new NullPointerTester();
        tester.setDefault(FileStorage.class, Mockito.mock(FileStorage.class));
        tester.testAllPublicConstructors(FileRemoveProcess.class);

    }

    @Test
    @DisplayName("Should call file dao remove with file id and return removed file id")
    void testHandleWithoutExceptions() throws DataNotFoundException, AccessDeniedException {

        var fileRecord = new FileRecord(
                new RecordId<>("fileId"),
                new RecordId<>("folderId"),
                new RecordId<>("userId"),
                "oldName",
                "mimetype",
                123
        );

        var fileDao = Mockito.mock(FileDao.class);
        Mockito.when(fileDao.find(fileRecord.id()))
               .thenReturn(Optional.of(fileRecord));

        var fileStorage = Mockito.mock(FileStorage.class);

        var process = new FileRemoveProcess(fileDao, fileStorage);

        var command = new RemoveCommand(fileRecord.ownerId(),
                                        fileRecord.id());

        assertThat(process.handle(command))
                .isEqualTo(fileRecord.id());

        Mockito.verify(fileDao, Mockito.times(1))
               .delete(fileRecord.id());

        Mockito.verify(fileStorage, Mockito.times(1))
               .removeFile(fileRecord.id());

    }

    @Test
    @DisplayName("Should throw DataNotFoundException because file doesn't exist")
    void testHandleWithDataNotFoundException() {

        var fileId = new RecordId<>("fileId");

        var fileDao = Mockito.mock(FileDao.class);
        Mockito.when(fileDao.find(fileId))
               .thenReturn(Optional.empty());

        var fileStorage = Mockito.mock(FileStorage.class);

        var process = new FileRemoveProcess(fileDao, fileStorage);

        var command = new RemoveCommand(new RecordId<>("userid"),
                                        fileId);

        assertThrows(DataNotFoundException.class, () -> {
            process.handle(command);
        });

        Mockito.verify(fileDao, Mockito.never())
               .delete(any());

        Mockito.verify(fileStorage, Mockito.never())
               .removeFile(any());

    }

    @Test
    @DisplayName("Should throw AccessDeniedException because user not owner")
    void testHandleWithAccessDeniedException() {

        var fileRecord = new FileRecord(
                new RecordId<>("fileId"),
                new RecordId<>("folderId"),
                new RecordId<>("userId"),
                "oldName",
                "mimetype",
                123
        );

        var fileDao = Mockito.mock(FileDao.class);
        Mockito.when(fileDao.find(fileRecord.id()))
               .thenReturn(Optional.of(fileRecord));

        var fileStorage = Mockito.mock(FileStorage.class);

        var process = new FileRemoveProcess(fileDao, fileStorage);

        var command = new RemoveCommand(new RecordId<>("notOwnerUserId"),
                                        fileRecord.id());

        assertThrows(AccessDeniedException.class, () -> {
            process.handle(command);
        });

        Mockito.verify(fileDao, Mockito.never())
               .delete(any());

        Mockito.verify(fileStorage, Mockito.never())
               .removeFile(any());

    }

}

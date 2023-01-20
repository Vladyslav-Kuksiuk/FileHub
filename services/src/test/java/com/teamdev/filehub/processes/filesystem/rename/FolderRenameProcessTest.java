package com.teamdev.filehub.processes.filesystem.rename;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

class FolderRenameProcessTest {

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void nullTest() {

        var tester = new NullPointerTester();
        tester.testAllPublicConstructors(FolderRenameProcess.class);

    }

    @Test
    @DisplayName("Should call folder dao update with new name and return folder id")
    void testHandleWithoutExceptions() throws DataNotFoundException, AccessDeniedException {

        var folderRecord = new FolderRecord(
                new RecordId<>("folderId"),
                new RecordId<>("userId"),
                new RecordId<>("parentFolderId"),
                "oldName"
        );

        var newName = "newName";

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderRecord.id()))
               .thenReturn(Optional.of(folderRecord));

        var process = new FolderRenameProcess(folderDao);

        var command = new RenameCommand(folderRecord.ownerId(),
                                        folderRecord.id(),
                                        newName);

        assertThat(process.handle(command))
                .isEqualTo(folderRecord.id());

        Mockito.verify(folderDao, Mockito.times(1))
               .update(new FolderRecord(
                       folderRecord.id(),
                       folderRecord.ownerId(),
                       folderRecord.parentFolderId(),
                       newName));

    }

    @Test
    @DisplayName("Should throw DataNotFoundException because because folder doesn't exist")
    void testHandleWithDataNotFoundException() {

        var folderId = new RecordId<>("folderId");

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderId))
               .thenReturn(Optional.empty());

        var process = new FolderRenameProcess(folderDao);

        var command = new RenameCommand(new RecordId<>("userid"),
                                        folderId,
                                        "newName");

        assertThrows(DataNotFoundException.class, () -> {
            process.handle(command);
        });

        Mockito.verify(folderDao, Mockito.never())
               .update(any());

    }

    @Test
    @DisplayName("Should throw AccessDeniedException because user not owner")
    void testHandleWithAccessDeniedException() {

        var folderRecord = new FolderRecord(
                new RecordId<>("folderId"),
                new RecordId<>("userId"),
                new RecordId<>("parentFolderId"),
                "oldName"
        );

        var newName = "newName";

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderRecord.id()))
               .thenReturn(Optional.of(folderRecord));

        var process = new FolderRenameProcess(folderDao);

        var command = new RenameCommand(new RecordId<>("notOwnerUserId"),
                                        folderRecord.id(),
                                        newName);

        assertThrows(AccessDeniedException.class, () -> {
            process.handle(command);
        });

        Mockito.verify(folderDao, Mockito.never())
               .update(any());

    }

}

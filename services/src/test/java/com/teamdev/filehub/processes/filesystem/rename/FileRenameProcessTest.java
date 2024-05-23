package com.teamdev.filehub.processes.filesystem.rename;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

class FileRenameProcessTest {

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void nullTest() {

        var tester = new NullPointerTester();
        tester.testAllPublicConstructors(FileRenameProcess.class);

    }

    @Test
    @DisplayName("Should call file dao update with new name and return file id")
    void testHandleWithoutExceptions() throws DataNotFoundException, AccessDeniedException {

        var fileRecord = new FileRecord(
                new RecordId("fileId"),
                new RecordId("folderId"),
                new RecordId("userId"),
                "oldName",
                "mimetype",
                123,
                120,
                "ext"
        );

        var newName = "newName";

        var fileDao = Mockito.mock(FileDao.class);
        Mockito.when(fileDao.find(fileRecord.id()))
               .thenReturn(Optional.of(fileRecord));

        var process = new FileRenameProcess(fileDao);

        var command = new RenameCommand(fileRecord.ownerId(),
                                        fileRecord.id(),
                                        newName);

        assertThat(process.handle(command))
                .isEqualTo(fileRecord.id());

        Mockito.verify(fileDao, Mockito.times(1))
               .update(new FileRecord(
                       fileRecord.id(),
                       fileRecord.folderId(),
                       fileRecord.ownerId(),
                       newName,
                       fileRecord.mimetype(),
                       fileRecord.size(),
                       fileRecord.archivedSize(),
                       fileRecord.extension()));

    }

    @Test
    @DisplayName("Should throw DataNotFoundException because file doesn't exist")
    void testHandleWithDataNotFoundException() {

        var fileId = new RecordId("fileId");

        var fileDao = Mockito.mock(FileDao.class);
        Mockito.when(fileDao.find(fileId))
               .thenReturn(Optional.empty());

        var process = new FileRenameProcess(fileDao);

        var command = new RenameCommand(new RecordId("userid"),
                                        fileId,
                                        "newName");

        assertThrows(DataNotFoundException.class, () -> {
            process.handle(command);
        });

        Mockito.verify(fileDao, Mockito.never())
               .update(any());

    }

    @Test
    @DisplayName("Should throw AccessDeniedException because user not owner")
    void testHandleWithAccessDeniedException() {

        var fileRecord = new FileRecord(
                new RecordId("fileId"),
                new RecordId("folderId"),
                new RecordId("userId"),
                "oldName",
                "mimetype",
                123,
                120,
                "ext"
        );
        var newName = "newName";

        var fileDao = Mockito.mock(FileDao.class);
        Mockito.when(fileDao.find(fileRecord.id()))
               .thenReturn(Optional.of(fileRecord));

        var process = new FileRenameProcess(fileDao);

        var command = new RenameCommand(new RecordId("notOwnerUserId"),
                                        fileRecord.id(),
                                        newName);

        assertThrows(AccessDeniedException.class, () -> {
            process.handle(command);
        });

        Mockito.verify(fileDao, Mockito.never())
               .update(any());

    }

}

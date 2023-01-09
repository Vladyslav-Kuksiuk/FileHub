package com.teamdev.filehub.processes.foldercreate;

import com.teamdev.filehub.FolderDaoFake;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.CommandValidationException;
import com.teamdev.filehub.processes.folder.create.FolderCreateCommand;
import com.teamdev.filehub.processes.folder.create.FolderCreateException;
import com.teamdev.filehub.processes.folder.create.FolderCreateProcess;
import com.teamdev.filehub.processes.folder.create.FolderCreateProcessImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

class FolderCreateProcessImplTest {

    private FolderDao folderDao;
    private FolderCreateProcess folderCreateProcess;

    private FolderRecord rootFolder;

    @BeforeEach
    void setUp() {
        folderDao = new FolderDaoFake();
        folderCreateProcess = new FolderCreateProcessImpl(folderDao);

        rootFolder = new FolderRecord(
                new RecordId<>("user1-root-folder-id"),
                new RecordId<>("user1"),
                new RecordId<>(null),
                "user1-root-folder");

        folderDao.create(rootFolder);

    }

    @Test
    void folderCreationTest() throws CommandValidationException,
                                     AccessDeniedException {

        FolderCreateCommand command = new FolderCreateCommand(rootFolder.ownerId(),
                                                              rootFolder.id(),
                                                              "newFolder");

        RecordId<String> createdFolderId = folderCreateProcess.handle(command);

        assertWithMessage("Folder creation failed.")
                .that(folderDao.find(createdFolderId)
                               .get()
                               .name())
                .isEqualTo("newFolder");

    }

    @Test
    void sameFolderAlreadyExists() throws CommandValidationException {

        FolderRecord folder = new FolderRecord(
                new RecordId<>("user1-folder-id"),
                new RecordId<>("user1"),
                new RecordId<>("user1-root-folder-id"),
                "folder");

        folderDao.create(folder);

        FolderCreateCommand command = new FolderCreateCommand(rootFolder.ownerId(),
                                                              rootFolder.id(),
                                                              "folder");

        assertThrows(FolderCreateException.class,
                     () -> folderCreateProcess.handle(command),
                     "Same folder(path and name) creation not failed");

    }

    @Test
    void folderCreationNotByOwnerTest() throws CommandValidationException {
        FolderCreateCommand command = new FolderCreateCommand(new RecordId<>("user2"),
                                                              rootFolder.id(),
                                                              "folder");

        assertThrows(FolderCreateException.class,
                     () -> folderCreateProcess.handle(command),
                     "Folder creation by non-owner user not failed");
    }
}

package com.teamdev.filehub.processes.foldercreate;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.FolderDaoFake;
import com.teamdev.filehub.RequestFieldValidationException;
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
    void folderCreationTest() throws
                              AccessDeniedException, RequestFieldValidationException {

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
    void folderCreationNotByOwnerTest() throws RequestFieldValidationException {
        FolderCreateCommand command = new FolderCreateCommand(new RecordId<>("user2"),
                                                              rootFolder.id(),
                                                              "folder");

        assertThrows(AccessDeniedException.class,
                     () -> folderCreateProcess.handle(command),
                     "Folder creation by non-owner user not failed");
    }
}

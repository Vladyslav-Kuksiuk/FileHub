package com.teamdev.filehub.processes.upload;

import com.teamdev.filehub.FileDaoFake;
import com.teamdev.filehub.FileStorageStub;
import com.teamdev.filehub.FolderDaoFake;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.processes.AccessDeniedException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.NoSuchElementException;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

class FileUploadProcessUnitTest {

    private FileDao fileDao;
    private FileUploadProcess fileUploadProcess;
    private FolderRecord rootFolder;

    @BeforeEach
    void setUp() {

        FolderDao folderDao = new FolderDaoFake();

        fileDao = new FileDaoFake();

        FileStorageStub fileStorageStub = new FileStorageStub();

        fileUploadProcess = new FileUploadProcessImpl(folderDao,
                                                      fileDao,
                                                      fileStorageStub);

        rootFolder = new FolderRecord(
                new RecordId<>("user_root"),
                new RecordId<>("user"),
                new RecordId<>(null),
                "user");

        folderDao.create(rootFolder);

    }

    @Test
    void fileUploadTest() throws AccessDeniedException {

        InputStream fileInputStream = new ByteArrayInputStream("test".getBytes());

        FileUploadCommand command = new FileUploadCommand(rootFolder.ownerId(),
                                                          rootFolder.id(),
                                                          "myFile",
                                                          "txt",
                                                          123,
                                                          fileInputStream);

        RecordId<String> fileId = fileUploadProcess.handle(command);

        assertWithMessage("File uploading failed")
                .that(fileDao.find(fileId)
                             .get()
                             .ownerId())
                .isEqualTo(new RecordId<>("user"));

    }

    @Test
    void fileUploadWithoutAccessTest() {

        InputStream fileInputStream = new ByteArrayInputStream("test".getBytes());

        FileUploadCommand command = new FileUploadCommand(new RecordId<>("user1"),
                                                          rootFolder.id(),
                                                          "myFile",
                                                          "txt",
                                                          123,
                                                          fileInputStream);

        assertThrows(AccessDeniedException.class,
                     () -> fileUploadProcess.handle(command),
                     "File uploading by non-owner user not failed");
    }

    @Test
    void fileUploadToAbsentFolderTest() {

        InputStream fileInputStream = new ByteArrayInputStream("test".getBytes());

        FileUploadCommand command = new FileUploadCommand(rootFolder.ownerId(),
                                                          new RecordId<>("notAFolder"),
                                                          "myFile",
                                                          "txt",
                                                          123,
                                                          fileInputStream);

        assertThrows(NoSuchElementException.class,
                     () -> fileUploadProcess.handle(command),
                     "File uploading to absent folder not failed");
    }

    @Test
    void uploadSameFilesTest() throws AccessDeniedException {

        InputStream fileInputStream = new ByteArrayInputStream("test".getBytes());

        FileUploadCommand command = new FileUploadCommand(rootFolder.ownerId(),
                                                          rootFolder.id(),
                                                          "myFile",
                                                          "txt",
                                                          123,
                                                          fileInputStream);

        fileUploadProcess.handle(command);

        assertThrows(AccessDeniedException.class,
                     () -> fileUploadProcess.handle(command),
                     "File uploading to absent folder not failed");
    }
}

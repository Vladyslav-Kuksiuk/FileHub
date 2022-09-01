package com.teamdev.processes.upload;

import com.teamdev.FileDaoFake;
import com.teamdev.FileStorageStub;
import com.teamdev.FolderDaoFake;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.file.FileDao;
import com.teamdev.persistent.dao.folder.FolderDao;
import com.teamdev.persistent.dao.folder.FolderRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

class FileUploadProcessUnitTest {

    private FileDao fileDao;
    private FileUploadProcess fileUploadProcess;
    private FolderRecord rootFolder;

    @BeforeEach
    void setUp() throws DataAccessException {

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
    void fileUploadTest() throws FileUploadException, DataAccessException {

        InputStream fileInputStream = new ByteArrayInputStream("test".getBytes());

        FileUploadCommand command = new FileUploadCommand(rootFolder.ownerId(),
                                                          rootFolder.id(),
                                                          "myFile",
                                                          "txt",
                                                          fileInputStream);

        RecordId<String> fileId = fileUploadProcess.handle(command);

        assertWithMessage("File uploading failed")
                .that(fileDao.find(fileId)
                             .ownerId())
                .isEqualTo(new RecordId<>("user"));

    }

    @Test
    void fileUploadWithoutAccessTest() {

        InputStream fileInputStream = new ByteArrayInputStream("test".getBytes());

        FileUploadCommand command = new FileUploadCommand(new RecordId<>("user1"),
                                                          rootFolder.parentFolderId(),
                                                          "myFile",
                                                          "txt",
                                                          fileInputStream);

        assertThrows(FileUploadException.class,
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
                                                          fileInputStream);

        assertThrows(FileUploadException.class,
                     () -> fileUploadProcess.handle(command),
                     "File uploading to absent folder not failed");
    }

    @Test
    void uploadSameFilesTest() throws FileUploadException {

        InputStream fileInputStream = new ByteArrayInputStream("test".getBytes());

        FileUploadCommand command = new FileUploadCommand(rootFolder.ownerId(),
                                                          rootFolder.id(),
                                                          "myFile",
                                                          "txt",
                                                          fileInputStream);

        fileUploadProcess.handle(command);

        assertThrows(FileUploadException.class,
                     () -> fileUploadProcess.handle(command),
                     "File uploading to absent folder not failed");
    }
}
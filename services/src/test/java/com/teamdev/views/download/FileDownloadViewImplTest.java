package com.teamdev.views.download;

import com.teamdev.FileDaoFake;
import com.teamdev.FileStorageStub;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.file.FileDao;
import com.teamdev.persistent.dao.file.FileRecord;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

class FileDownloadViewImplTest {

    private FileDao fileDao;
    private FileDownloadView fileDownloadView;

    @BeforeEach
    void setUp() throws DataAccessException {

        fileDao = new FileDaoFake();

        FileStorageStub fileStorageStub = new FileStorageStub();

        fileDownloadView = new FileDownloadViewImpl(fileDao,
                                                    fileStorageStub);

        FileRecord fileRecord = new FileRecord(new RecordId<>("uploadedFileId"),
                                               new RecordId<>("user_root"),
                                               new RecordId<>("user"),
                                               "myFile",
                                               "txt");

        fileDao.create(fileRecord);

    }

    @Test
    void fileDownloadTest() throws FileAccessDeniedException, IOException {

        FileDownloadQuery query = new FileDownloadQuery(new RecordId<>("user"),
                                                        new RecordId<>("uploadedFileId"));

        InputStream fileInputStream = fileDownloadView.handle(query)
                                                      .fileInput();

        assertWithMessage("File downloading failed.")
                .that(new String(fileInputStream.readAllBytes(), StandardCharsets.UTF_8))
                .matches(FileStorageStub.INPUT_STRING);

    }

    @Test
    void downloadAbsentFileTest() {

        FileDownloadQuery query = new FileDownloadQuery(new RecordId<>("user"),
                                                        new RecordId<>("notUploadedFileId"));

        assertThrows(FileAccessDeniedException.class,
                     () -> fileDownloadView.handle(query),
                     "Absent file download not failed.");

    }

    @Test
    void downloadFileWithoutAccessTest() {

        FileDownloadQuery query = new FileDownloadQuery(new RecordId<>("notOwner"),
                                                        new RecordId<>("uploadedFileId"));

        assertThrows(FileAccessDeniedException.class,
                     () -> fileDownloadView.handle(query),
                     "DFile downloading by non-owner user not failed.");

    }
}
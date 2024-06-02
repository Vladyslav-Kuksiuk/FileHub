package com.teamdev.filehub.views.download;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.FileDaoFake;
import com.teamdev.filehub.FileStorageStub;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
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
    void setUp() {

        fileDao = new FileDaoFake();

        FileStorageStub fileStorageStub = new FileStorageStub();

        fileDownloadView = new FileDownloadViewImpl(fileDao,
                                                    fileStorageStub);

        FileRecord fileRecord = new FileRecord(new RecordId("uploadedFileId"),
                                               new RecordId("user_root"),
                                               new RecordId("user"),
                                               "myFile",
                                               "txt",
                                               123,
                120,
                "ext");

        fileDao.create(fileRecord);

    }

    @Test
    void fileDownloadTest() throws IOException, DataNotFoundException, AccessDeniedException {

        FileDownloadQuery query = new FileDownloadQuery(new RecordId("user"),
                                                        new RecordId("uploadedFileId"));

        InputStream fileInputStream = fileDownloadView.handle(query);

        assertWithMessage("File downloading failed.")
                .that(new String(fileInputStream.readAllBytes(), StandardCharsets.UTF_8))
                .matches(FileStorageStub.INPUT_STRING);

    }

    @Test
    void downloadAbsentFileTest() {

        FileDownloadQuery query = new FileDownloadQuery(new RecordId("user"),
                                                        new RecordId("notUploadedFileId"));

        assertThrows(DataNotFoundException.class,
                     () -> fileDownloadView.handle(query),
                     "Absent file download not failed.");

    }

    @Test
    void downloadFileWithoutAccessTest() {

        FileDownloadQuery query = new FileDownloadQuery(new RecordId("notOwner"),
                                                        new RecordId("uploadedFileId"));

        assertThrows(AccessDeniedException.class,
                     () -> fileDownloadView.handle(query),
                     "DFile downloading by non-owner user not failed.");

    }
}

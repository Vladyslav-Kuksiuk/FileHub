package com.teamdev.filehub.views.download;

import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.InMemoryFileDao;
import com.teamdev.filehub.file.FileData;
import com.teamdev.filehub.filestorage.FileStorage;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import static com.google.common.truth.Truth.assertWithMessage;

class FileDownloadViewIntegrationTest {

    @Test
    void downloadTest() throws IOException,
                               FileAccessDeniedException, InterruptedException {

        InMemoryDatabase database = new InMemoryDatabase();
        FileDao fileDao = new InMemoryFileDao(database);
        FileStorage fileStorage = new FileStorage();
        database.clean();

        database.fileTable()
                .addData(new FileData("myFile",
                                      "user_root",
                                      "user",
                                      "myFile",
                                      "txt"));

        Thread.sleep(2000);

        File newFile = new File(FileStorage.STORAGE_FOLDER_PATH + "myFile");

        if (newFile.exists()) {
            newFile.delete();
            newFile.createNewFile();
        }

        InputStream newFileInput = new ByteArrayInputStream("Test File".getBytes());

        try (OutputStream outStream = new FileOutputStream(newFile)) {

            byte[] buffer = new byte[8 * 1024];
            int bytesRead;
            while ((bytesRead = newFileInput.read(buffer)) != -1) {
                outStream.write(buffer, 0, bytesRead);
            }
            newFileInput.close();

        }

        FileDownloadView downloadView = new FileDownloadViewImpl(fileDao, fileStorage);

        FileDownloadQuery downloadQuery = new FileDownloadQuery(new RecordId<>("user"),
                                                                new RecordId<>("myFile"));

        InputStream storageFileInput = downloadView.handle(downloadQuery)
                                                   .fileInput();

        String storedTestText = new String(storageFileInput.readAllBytes(), StandardCharsets.UTF_8);

        assertWithMessage("File downloading failed.")
                .that(storedTestText)
                .isEqualTo("Test File");

    }
}
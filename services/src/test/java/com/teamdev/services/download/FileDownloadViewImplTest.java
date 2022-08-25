package com.teamdev.services.download;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.file.FileData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.filestorage.FileStorage;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import static com.google.common.truth.Truth.assertWithMessage;

class FileDownloadViewImplTest {

    @Test
    void downloadTest() throws DatabaseException, DatabaseTransactionException, IOException,
                               DataAccessException {

        InMemoryDatabase database = new InMemoryDatabase();
        FileStorage fileStorage = new FileStorage();
        database.clean();

        database.fileTable()
                .addFile(new FileData("user\\myFile.txt",
                                      "user",
                                      "user\\myFile.txt"));

        File newFile = new File(FileStorage.STORAGE_FOLDER_PATH + "user\\myFile.txt");

        InputStream newFileInput = new ByteArrayInputStream("Test File".getBytes());

        try (OutputStream outStream = new FileOutputStream(newFile)) {

            byte[] buffer = new byte[8 * 1024];
            int bytesRead;
            while ((bytesRead = newFileInput.read(buffer)) != -1) {
                outStream.write(buffer, 0, bytesRead);
            }
            newFileInput.close();

        }

        InputStream storageFileInput = fileStorage.downloadFile("user\\myFile.txt");

        String storedTestText = new String(storageFileInput.readAllBytes(), StandardCharsets.UTF_8);

        assertWithMessage("File downloading failed.")
                .that(storedTestText)
                .isEqualTo("Test File");

    }
}
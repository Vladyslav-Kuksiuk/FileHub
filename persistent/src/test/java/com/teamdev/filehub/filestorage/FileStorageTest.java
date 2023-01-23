package com.teamdev.filehub.filestorage;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class FileStorageTest {

    @TempDir
    private File tempDir;

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(FileStorage.class);
    }

    @Test
    @DisplayName("Should create file on constructing if it doesn't exist")
    void testFileCreationInConstructor() {
        var folderPath = tempDir.getPath();

        var file = new File(folderPath + File.separator + "FileStorage");

        assertThat(file.exists()).isFalse();

        var fileStorage = new FileStorage(folderPath);

        assertThat(file.exists()).isTrue();
    }

    @Test
    @DisplayName("Should remove file by id")
    void testRemoveFile() {
        var folderPath = tempDir.getPath();

        var fileId = new RecordId("fileId");

        var file = new File(folderPath +
                                    File.separator +
                                    "FileStorage" +
                                    File.separator +
                                    fileId.value());

        assertThat(file.exists()).isFalse();

        file.mkdirs();

        assertThat(file.exists()).isTrue();

        var fileStorage = new FileStorage(folderPath);
        fileStorage.removeFile(fileId);

        assertThat(file.exists()).isFalse();
    }

    @Test
    @DisplayName("Should throw RuntimeException on removing absent file by id")
    void testRemoveFileWithAbsentFile() {
        var folderPath = tempDir.getPath();

        var fileId = new RecordId("fileId");

        var file = new File(folderPath +
                                    File.separator +
                                    "FileStorage" +
                                    File.separator +
                                    fileId.value());

        assertThat(file.exists()).isFalse();

        var fileStorage = new FileStorage(folderPath);
        assertThrows(RuntimeException.class,
                     () -> fileStorage.removeFile(fileId));
    }

    @Test
    @DisplayName("Should save InputStream in file by given id")
    void testUploadFile() throws IOException {
        var folderPath = tempDir.getPath();

        var fileId = new RecordId("fileId");

        var file = new File(folderPath +
                                    File.separator +
                                    "FileStorage" +
                                    File.separator +
                                    fileId.value());

        assertThat(file.exists()).isFalse();

        var testString = "Some useful information";

        var inputStream = new ByteArrayInputStream(testString.getBytes());

        var fileStorage = new FileStorage(folderPath);

        fileStorage.uploadFile(fileId, inputStream);

        assertThat(file.exists()).isTrue();

        try (var reader = new FileReader(file);
             var scanner = new Scanner(reader)
        ) {
            var fileLine = scanner.nextLine();

            assertThat(fileLine).isEqualTo(testString);
        }
    }

    @Test
    @DisplayName("Should get InputStream from file by id")
    void testDownloadFile() throws IOException {

        var testString = "Some useful information";

        var folderPath = tempDir.getPath();

        var fileId = new RecordId("fileId");

        var file = new File(folderPath +
                                    File.separator +
                                    "FileStorage" +
                                    File.separator +
                                    fileId.value());

        var fileStorage = new FileStorage(folderPath);

        assertThat(file.exists()).isFalse();

        file.createNewFile();

        try (var writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(testString);
        }

        var downloadedFileStream = fileStorage.downloadFile(fileId);

        var downloadedString = new String(downloadedFileStream.readAllBytes(),
                                          StandardCharsets.UTF_8);

        assertThat(downloadedString).isEqualTo(testString);

        downloadedFileStream.close();
    }

    @Test
    @DisplayName("Should throw RuntimeException on downloading absent file by id")
    void testDownloadFileWithAbsentFile() {
        var folderPath = tempDir.getPath();

        var fileId = new RecordId("fileId");

        var file = new File(folderPath +
                                    File.separator +
                                    "FileStorage" +
                                    File.separator +
                                    fileId.value());

        assertThat(file.exists()).isFalse();

        var fileStorage = new FileStorage(folderPath);
        assertThrows(RuntimeException.class,
                     () -> fileStorage.downloadFile(fileId));
    }

}

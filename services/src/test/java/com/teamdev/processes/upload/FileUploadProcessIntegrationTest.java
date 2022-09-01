package com.teamdev.processes.upload;

import com.teamdev.ServiceLocator;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.filestorage.FileStorage;
import com.teamdev.processes.authentication.UserAuthenticationCommand;
import com.teamdev.processes.authentication.UserAuthenticationProcess;
import com.teamdev.processes.authentication.UserAuthenticationResponse;
import com.teamdev.processes.authentication.UserDataMismatchException;
import com.teamdev.processes.register.UserAlreadyRegisteredException;
import com.teamdev.processes.register.UserRegistrationCommand;
import com.teamdev.processes.register.UserRegistrationProcess;
import com.teamdev.servicelocator.ServiceLocatorImpl;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import static com.google.common.truth.Truth.assertWithMessage;

class FileUploadProcessIntegrationTest {

    @Test
    void fileUploadTest() throws IOException,
                                 InterruptedException, FileUploadException,
                                 UserAlreadyRegisteredException, UserDataMismatchException {

        String testFolderPath = InMemoryDatabase.DATABASE_FOLDER_PATH + "Test\\";

        File filesDirectory = new File(testFolderPath);
        if (!filesDirectory.exists()) {
            filesDirectory.mkdirs();
        }

        File testFile = new File(testFolderPath + "hello.txt");

        if (!testFile.exists()) {
            testFile.createNewFile();
            FileWriter writer = new FileWriter(testFile);
            writer.write("Hello world!");
            writer.close();
        }

        InMemoryDatabase database = new InMemoryDatabase();
        database.clean();

        ServiceLocator locator = new ServiceLocatorImpl();

        UserRegistrationProcess registrationProcess = locator.locate(UserRegistrationProcess.class);
        UserAuthenticationProcess authenticationProcess = locator.locate(
                UserAuthenticationProcess.class);
        FileUploadProcess uploadProcess = locator.locate(FileUploadProcess.class);

        RecordId<String> userId = registrationProcess.handle(
                new UserRegistrationCommand("user",
                                            "password",
                                            "email@email.com"));
        UserAuthenticationResponse authResp = authenticationProcess.handle(
                new UserAuthenticationCommand("user",
                                              "password"));

        InputStream inputStream = new FileInputStream(
                new File(testFolderPath + "hello.txt"));

        RecordId<String> fileId = uploadProcess.handle(new FileUploadCommand(userId,
                                                                             new RecordId<>(
                                                                                     "user_root"),
                                                                             "hello",
                                                                             "txt",
                                                                             inputStream));

        File testingFile = new File(FileStorage.STORAGE_FOLDER_PATH + fileId.value());
        InputStream testFileStream = new FileInputStream(testingFile);
        String testText = new String(testFileStream.readAllBytes(), StandardCharsets.UTF_8);

        assertWithMessage("File uploading failed.")
                .that(testText)
                .isEqualTo("Hello world!");
    }
}
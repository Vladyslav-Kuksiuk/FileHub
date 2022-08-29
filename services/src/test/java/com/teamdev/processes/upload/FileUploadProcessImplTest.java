package com.teamdev.processes.upload;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.filestorage.FileStorage;
import com.teamdev.processes.upload.FileUploadCommand;
import com.teamdev.processes.upload.FileUploadProcess;
import com.teamdev.ServiceLocator;
import com.teamdev.processes.authentication.UserAuthenticationCommand;
import com.teamdev.processes.authentication.UserAuthenticationProcess;
import com.teamdev.processes.authentication.UserAuthenticationResponse;
import com.teamdev.processes.register.UserRegistrationCommand;
import com.teamdev.processes.register.UserRegistrationProcess;
import com.teamdev.processes.register.UserRegistrationResponse;
import com.teamdev.servicelocator.ServiceLocatorImpl;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import static com.google.common.truth.Truth.assertWithMessage;

class FileUploadProcessImplTest {

    @Test
    void run() throws DataAccessException, IOException, DatabaseException, InterruptedException {

        String testFolderPath = InMemoryDatabase.DATABASE_FOLDER_PATH+"Test\\";

        File filesDirectory = new File(testFolderPath);
        if(!filesDirectory.exists()){
            filesDirectory.mkdirs();
        }

        File testFile = new File(testFolderPath+"hello.txt");

        if(!testFile.exists()){
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

        UserRegistrationResponse regResp = registrationProcess.run(
                new UserRegistrationCommand("user",
                                            "password",
                                            "email@email.com"));
        UserAuthenticationResponse authResp = authenticationProcess.run(
                new UserAuthenticationCommand("user",
                                              "password"));

        InputStream inputStream = new FileInputStream(
                new File(testFolderPath+"hello.txt"));

        uploadProcess.run(new FileUploadCommand(regResp.userId(),
                                                authResp.authenticationToken(),
                                                "user\\hello.txt",
                                                inputStream));

        InputStream testFileStream = new FileInputStream(
                new File(FileStorage.STORAGE_FOLDER_PATH + "user\\hello.txt"));
        String testText = new String(testFileStream.readAllBytes(), StandardCharsets.UTF_8);

        Thread.sleep(3000);

        assertWithMessage("File uploading failed.")
                .that(testText)
                .isEqualTo("Hello world!");

        Thread.sleep(3000);

    }
}
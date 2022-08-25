package com.teamdev.services.upload;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.filestorage.FileStorage;
import com.teamdev.services.ServiceLocator;
import com.teamdev.services.authentication.UserAuthenticationCommand;
import com.teamdev.services.authentication.UserAuthenticationProcess;
import com.teamdev.services.authentication.UserAuthenticationResponse;
import com.teamdev.services.register.UserRegistrationCommand;
import com.teamdev.services.register.UserRegistrationProcess;
import com.teamdev.services.register.UserRegistrationResponse;
import com.teamdev.services.servicelocator.ServiceLocatorImpl;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileInputStream;
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
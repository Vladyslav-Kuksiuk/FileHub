package com.teamdev.filehub.processes.upload;

import com.teamdev.filehub.ApplicationContext;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationCommand;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationResponse;
import com.teamdev.filehub.processes.user.authentication.UserDataMismatchException;
import com.teamdev.filehub.processes.file.upload.FileUploadCommand;
import com.teamdev.filehub.processes.file.upload.FileUploadProcess;
import com.teamdev.filehub.processes.user.register.FieldValidationException;
import com.teamdev.filehub.processes.user.register.UserAlreadyRegisteredException;
import com.teamdev.filehub.processes.user.register.UserRegistrationCommand;
import com.teamdev.filehub.processes.user.register.UserRegistrationProcess;
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
                                 UserAlreadyRegisteredException, UserDataMismatchException,
                                 FieldValidationException, AccessDeniedException {

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

        ApplicationContext context = new ApplicationContext();

        UserRegistrationProcess registrationProcess = context.getUserRegistrationProcess();
        UserAuthenticationProcess authenticationProcess =context.getUserAuthenticationProcess();
        FileUploadProcess uploadProcess = context.getFileUploadProcess();

        RecordId<String> userId = registrationProcess.handle(
                new UserRegistrationCommand("email@email.com",
                                            "password1"));
        UserAuthenticationResponse authResp = authenticationProcess.handle(
                new UserAuthenticationCommand("email@email.com",
                                              "password1"));

        InputStream inputStream = new FileInputStream(
                new File(testFolderPath + "hello.txt"));

        RecordId<String> fileId = uploadProcess.handle(new FileUploadCommand(userId,
                                                                             new RecordId<>(
                                                                                     "email@email.com_root"),
                                                                             "hello",
                                                                             "txt",
                                                                             123,
                                                                             inputStream));

        File testingFile = new File(FileStorage.STORAGE_FOLDER_PATH + fileId.value());
        InputStream testFileStream = new FileInputStream(testingFile);
        String testText = new String(testFileStream.readAllBytes(), StandardCharsets.UTF_8);

        assertWithMessage("File uploading failed.")
                .that(testText)
                .isEqualTo("Hello world!");
    }
}

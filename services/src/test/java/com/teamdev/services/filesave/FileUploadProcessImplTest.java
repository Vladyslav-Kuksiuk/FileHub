package com.teamdev.services.filesave;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.DataAccessException;
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
import java.io.FileNotFoundException;
import java.io.InputStream;

class FileUploadProcessImplTest {

    @Test
    void run() throws DataAccessException, FileNotFoundException, DatabaseException {

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
                new File("C:\\Programming\\Database\\Test\\hello.txt"));

        uploadProcess.run(new FileUploadCommand(regResp.userId(),
                                                authResp.authenticationToken(),
                                                "user\\hello.txt",
                                                inputStream));

    }
}
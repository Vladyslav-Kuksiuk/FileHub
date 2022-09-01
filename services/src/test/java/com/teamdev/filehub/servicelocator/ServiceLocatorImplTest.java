package com.teamdev.filehub.servicelocator;

import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.ServiceLocator;
import com.teamdev.filehub.processes.authentication.UserAuthenticationCommand;
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.authentication.UserAuthenticationResponse;
import com.teamdev.filehub.processes.authentication.UserDataMismatchException;
import com.teamdev.filehub.processes.register.UserAlreadyRegisteredException;
import com.teamdev.filehub.processes.register.UserRegistrationCommand;
import com.teamdev.filehub.processes.register.UserRegistrationProcess;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class ServiceLocatorImplTest {

    @Test
    void locateTest() throws InterruptedException, UserDataMismatchException {
        InMemoryDatabase database = new InMemoryDatabase();
        database.clean();

        ServiceLocator locator = new ServiceLocatorImpl();

        UserRegistrationProcess registrationProcess = locator.locate(UserRegistrationProcess.class);

        try {
            registrationProcess.handle(new UserRegistrationCommand("SLuser",
                                                                   "SLpassword",
                                                                   "email@email.com"));
        } catch (UserAlreadyRegisteredException exception) {

        }

        UserAuthenticationProcess authProcess = locator.locate(UserAuthenticationProcess.class);

        UserAuthenticationResponse authResponse = authProcess.handle(
                new UserAuthenticationCommand("SLuser", "SLpassword"));

        Thread.sleep(3000);

        database = new InMemoryDatabase();

        assertWithMessage(
                "User registration and authentication process, picket from ServiceLocator failed.")
                .that(authResponse.authenticationToken())
                .isEqualTo(database.authenticationTable()
                                   .findByUserId("SLuser")
                                   .get()
                                   .authenticationToken());

    }
}
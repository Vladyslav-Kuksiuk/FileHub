package com.teamdev.servicelocator;

import com.teamdev.ServiceLocator;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.processes.authentication.UserAuthenticationCommand;
import com.teamdev.processes.authentication.UserAuthenticationProcess;
import com.teamdev.processes.authentication.UserAuthenticationResponse;
import com.teamdev.processes.authentication.UserDataMismatchException;
import com.teamdev.processes.register.UserAlreadyRegisteredException;
import com.teamdev.processes.register.UserRegistrationCommand;
import com.teamdev.processes.register.UserRegistrationProcess;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class ServiceLocatorImplTest {

    @Test
    void locateTest() throws DataAccessException, DatabaseException, InterruptedException,
                             DatabaseTransactionException, UserDataMismatchException {
        InMemoryDatabase database = new InMemoryDatabase();
        database.clean();

        ServiceLocator locator = new ServiceLocatorImpl();

        UserRegistrationProcess registrationProcess = locator.locate(UserRegistrationProcess.class);

        try {
            registrationProcess.run(new UserRegistrationCommand("SLuser",
                                                                "SLpassword",
                                                                "email@email.com"));
        } catch (UserAlreadyRegisteredException exception) {

        }

        UserAuthenticationProcess authProcess = locator.locate(UserAuthenticationProcess.class);

        UserAuthenticationResponse authResponse = authProcess.run(
                new UserAuthenticationCommand("SLuser", "SLpassword"));

        Thread.sleep(3000);

        database = new InMemoryDatabase();

        System.err.println(database.authenticationTable()
                                   .getAuthenticationByUserId("SLuser")
                                   .authenticationToken());

        assertWithMessage(
                "User registration and authentication process, picket from ServiceLocator failed.")
                .that(authResponse.authenticationToken())
                .isEqualTo(database.authenticationTable()
                                   .getAuthenticationByUserId("SLuser")
                                   .authenticationToken());

    }
}
package com.teamdev.servicelocator;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.ServiceLocator;
import com.teamdev.processes.authentication.UserAuthenticationCommand;
import com.teamdev.processes.authentication.UserAuthenticationProcess;
import com.teamdev.processes.authentication.UserAuthenticationResponse;
import com.teamdev.processes.register.UserRegistrationCommand;
import com.teamdev.processes.register.UserRegistrationProcess;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class ServiceLocatorImplTest {

    @Test
    void locateTest() throws DataAccessException, DatabaseException, InterruptedException {
        InMemoryDatabase database = new InMemoryDatabase();
        database.clean();

        ServiceLocator locator = new ServiceLocatorImpl();

        UserRegistrationProcess registrationProcess = locator.locate(UserRegistrationProcess.class);

        try {
            registrationProcess.run(new UserRegistrationCommand("SLuser",
                                                                "SLpassword",
                                                                "email@email.com"));
        } catch (DataAccessException exception) {

        }

        UserAuthenticationProcess authProcess = locator.locate(UserAuthenticationProcess.class);

        UserAuthenticationResponse authResponse = authProcess.run(
                new UserAuthenticationCommand("SLuser", "SLpassword"));

        assertWithMessage(
                "User registration and authentication process, picket from ServiceLocator failed.")
                .that(authResponse.userId())
                .isEqualTo(new RecordIdentifier<>("SLuser"));

        Thread.sleep(3000);

    }
}
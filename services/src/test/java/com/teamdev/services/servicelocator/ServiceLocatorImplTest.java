package com.teamdev.services.servicelocator;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.services.ServiceLocator;
import com.teamdev.services.authentication.UserAuthenticationCommand;
import com.teamdev.services.authentication.UserAuthenticationProcess;
import com.teamdev.services.authentication.UserAuthenticationResponse;
import com.teamdev.services.register.UserRegistrationCommand;
import com.teamdev.services.register.UserRegistrationProcess;
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
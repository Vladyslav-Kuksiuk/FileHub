package com.teamdev.services.register;

import com.google.common.testing.NullPointerTester;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.services.UserDaoStab;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class UserRegistrationProcessUnitTest {

    @Test
    void registerTest() throws DataAccessException, DatabaseTransactionException,
                               DatabaseException {

        UserDaoStab dao = new UserDaoStab();
        UserRegistrationProcessImpl registrationProcess = new UserRegistrationProcessImpl(dao);

        UserRegistrationCommand command = new UserRegistrationCommand("Hellamb",
                                                                      "password",
                                                                      "email@email.com");

        registrationProcess.run(command);
        assertWithMessage("User registration failed.")
                .that(dao.usersMap()
                         .get(new RecordIdentifier<>("Hellamb"))
                         .email())
                .matches("email@email.com");
    }

    @Test
    void nullTest() throws NoSuchMethodException {

        UserDaoStab dao = new UserDaoStab();
        UserRegistrationProcessImpl registrationProcess = new UserRegistrationProcessImpl(dao);

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(registrationProcess, registrationProcess.getClass()
                                                                  .getMethod("run",
                                                                             UserRegistrationCommand.class));

    }

}
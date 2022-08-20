package com.teamdev.services.register;

import com.google.common.testing.NullPointerTester;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.user.InMemoryUserDao;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.services.ApplicationProcess;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class UserRegistrationProcessTest {

    private final InMemoryDatabase database;
    private final ApplicationProcess<UserRegistrationCommand, UserRegistrationResponse> registerProcess;

    UserRegistrationProcessTest() throws DatabaseException {
        database = new InMemoryDatabase();
        database.clean();

        UserDao userDao = new InMemoryUserDao(database);

        registerProcess =
                new UserRegistrationProcess(userDao);
    }

    @Test
    void registerTest() throws DataAccessException, DatabaseTransactionException,
                               DatabaseException {
        UserRegistrationCommand command = new UserRegistrationCommand("Hellamb",
                                                                      "password",
                                                                      "email@email.com");

        registerProcess.run(command);
        assertWithMessage("User registration failed.")
                .that(database.userTable()
                              .getUserById("Hellamb")
                              .email())
                .matches("email@email.com");
    }

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(registerProcess, registerProcess.getClass()
                                                          .getMethod("run",
                                                                     UserRegistrationCommand.class));

    }

}
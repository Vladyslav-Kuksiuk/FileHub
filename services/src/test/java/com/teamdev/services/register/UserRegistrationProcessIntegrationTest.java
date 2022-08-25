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

class UserRegistrationProcessIntegrationTest {

    private final InMemoryDatabase database;
    private final ApplicationProcess<UserRegistrationCommand, UserRegistrationResponse> registerProcess;

    UserRegistrationProcessIntegrationTest() throws DatabaseException, InterruptedException {
        database = new InMemoryDatabase();
        database.clean();

        UserDao userDao = new InMemoryUserDao(database);

        registerProcess =
                new UserRegistrationProcessImpl(userDao);

        Thread.sleep(3000);
    }

    @Test
    void registerTest() throws DataAccessException, DatabaseTransactionException,
                               DatabaseException, InterruptedException {
        UserRegistrationCommand command = new UserRegistrationCommand("Hellamb",
                                                                      "password",
                                                                      "email@email.com");

        registerProcess.run(command);
        assertWithMessage("User registration failed.")
                .that(database.userTable()
                              .getUserById("Hellamb")
                              .email())
                .matches("email@email.com");

        Thread.sleep(3000);
    }

    @Test
    void registerManyTest() throws DataAccessException, DatabaseTransactionException,
                                   DatabaseException, InterruptedException {

        for (int i = 0; i < 100; i++) {
            UserRegistrationCommand command = new UserRegistrationCommand("user" + i,
                                                                          "password",
                                                                          "email@email.com");

            registerProcess.run(command);

            if (i % 25 == 0) {
                Thread.sleep(4000);
            }

        }
        assertWithMessage("User registration failed.")
                .that(database.userTable()
                              .getUserById("user99")
                              .email())
                .matches("email@email.com");

        Thread.sleep(3000);
    }

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(registerProcess, registerProcess.getClass()
                                                          .getMethod("run",
                                                                     UserRegistrationCommand.class));

    }

}
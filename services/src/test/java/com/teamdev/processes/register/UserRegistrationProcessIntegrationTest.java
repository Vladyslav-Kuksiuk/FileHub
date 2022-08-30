package com.teamdev.processes.register;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.user.InMemoryUserDao;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.processes.ApplicationProcess;
import com.teamdev.processes.ProcessException;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class UserRegistrationProcessIntegrationTest {

    private final InMemoryDatabase database;
    private final ApplicationProcess<UserRegistrationCommand, RecordId<String>> registerProcess;

    UserRegistrationProcessIntegrationTest() throws DatabaseException, InterruptedException {
        database = new InMemoryDatabase();
        database.clean();

        UserDao userDao = new InMemoryUserDao(database);

        registerProcess =
                new UserRegistrationProcessImpl(userDao);

        Thread.sleep(1500);
    }

    @Test
    void registerTest() throws DatabaseTransactionException,
                               InterruptedException, ProcessException {
        UserRegistrationCommand command = new UserRegistrationCommand("Hellamb",
                                                                      "password",
                                                                      "email@email.com");

        registerProcess.handle(command);
        assertWithMessage("User registration failed.")
                .that(database.userTable()
                              .getDataById("Hellamb")
                              .email())
                .matches("email@email.com");

        Thread.sleep(1500);
    }

    @Test
    void registerManyTest() throws DatabaseTransactionException,
                                   InterruptedException, ProcessException {

        for (int i = 0; i < 100; i++) {
            UserRegistrationCommand command = new UserRegistrationCommand("user" + i,
                                                                          "password",
                                                                          "email@email.com");

            registerProcess.handle(command);

            if (i % 25 == 0) {
                Thread.sleep(1000);
            }

        }
        assertWithMessage("User registration failed.")
                .that(database.userTable()
                              .getDataById("user99")
                              .email())
                .matches("email@email.com");

        Thread.sleep(1500);
    }

}
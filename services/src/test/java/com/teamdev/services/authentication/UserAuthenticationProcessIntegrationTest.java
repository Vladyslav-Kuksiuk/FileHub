package com.teamdev.services.authentication;

import com.google.common.testing.NullPointerTester;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.user.UserData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.user.InMemoryUserDao;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.util.StringEncryptor;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class UserAuthenticationProcessIntegrationTest {

    private final InMemoryDatabase database = new InMemoryDatabase();
    private final UserDao userDao = new InMemoryUserDao(database);
    private final UserAuthenticationProcess authorizationProcess =
            new UserAuthenticationProcess(userDao);

    UserAuthenticationProcessIntegrationTest() throws DatabaseException {
    }

    @Test
    void authorizationTest() throws DataAccessException, DatabaseTransactionException,
                                    DatabaseException {
        database.clean();

        UserData user = new UserData("user", "user", StringEncryptor.encrypt("password"),
                                     "email@email.com");

        database.userTable()
                .addUser(user);

        UserAuthenticationCommand command = new UserAuthenticationCommand("user", "password");

        UserAuthenticationResponse response = authorizationProcess.run(command);

        assertWithMessage("User authorization failed.")
                .that(database.authorizationTable()
                              .getAuthorizationByUserId("user")
                              .authenticationToken())
                .matches(response.authenticationToken());
    }

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(authorizationProcess, authorizationProcess.getClass()
                                                                    .getMethod("run",
                                                                               UserAuthenticationCommand.class));

    }
}
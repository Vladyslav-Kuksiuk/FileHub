package com.teamdev.processes.authentication;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.user.UserData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.persistent.dao.authentication.InMemoryAuthenticationDao;
import com.teamdev.persistent.dao.user.InMemoryUserDao;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.util.StringEncryptor;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class UserAuthenticationProcessIntegrationTest {

    private final InMemoryDatabase database = new InMemoryDatabase();
    private final UserDao userDao = new InMemoryUserDao(database);
    private final AuthenticationDao authenticationDao = new InMemoryAuthenticationDao(database);
    private final UserAuthenticationProcessImpl authorizationProcess =
            new UserAuthenticationProcessImpl(userDao, authenticationDao);

    UserAuthenticationProcessIntegrationTest() throws DatabaseException {
    }

    @Test
    void authenticationTest() throws DataAccessException, DatabaseTransactionException,
                                     DatabaseException, UserDataMismatchException {
        database.clean();

        UserData user = new UserData("user", "user", StringEncryptor.encrypt("password"),
                                     "email@email.com");

        database.userTable()
                .addUser(user);

        UserAuthenticationCommand command = new UserAuthenticationCommand("user", "password");

        UserAuthenticationResponse response = authorizationProcess.handle(command);

        assertWithMessage("User authorization failed.")
                .that(database.authenticationTable()
                              .getAuthenticationByUserId("user")
                              .authenticationToken())
                .matches(response.authenticationToken());
    }
}
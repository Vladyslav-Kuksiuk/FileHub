package com.teamdev.filehub.processes.authentication;

import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.InMemoryAuthenticationDao;
import com.teamdev.filehub.dao.user.InMemoryUserDao;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationCommand;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationProcessImpl;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationResponse;
import com.teamdev.filehub.processes.user.authentication.UserDataMismatchException;
import com.teamdev.filehub.user.UserData;
import com.teamdev.util.StringEncryptor;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class UserAuthenticationProcessIntegrationTest {

    private final InMemoryDatabase database = new InMemoryDatabase();
    private final UserDao userDao = new InMemoryUserDao(database.userTable());
    private final AuthenticationDao authenticationDao =
            new InMemoryAuthenticationDao(database.authenticationTable());
    private final UserAuthenticationProcessImpl authorizationProcess =
            new UserAuthenticationProcessImpl(userDao, authenticationDao);

    UserAuthenticationProcessIntegrationTest() {
    }

    @Test
    void authenticationTest() throws UserDataMismatchException {
        database.clean();

        UserData user = new UserData("user", "user", StringEncryptor.encrypt("password"));

        database.userTable()
                .create(user);

        UserAuthenticationCommand command = new UserAuthenticationCommand("user", "password");

        UserAuthenticationResponse response = authorizationProcess.handle(command);

        assertWithMessage("User authorization failed.")
                .that(database.authenticationTable()
                              .findByUserId("user")
                              .get()
                              .authenticationToken())
                .matches(response.authenticationToken());
    }
}

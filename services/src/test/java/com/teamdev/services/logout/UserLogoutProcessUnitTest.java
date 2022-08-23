package com.teamdev.services.logout;

import com.google.common.testing.NullPointerTester;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.authentication.AuthenticationRecord;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.services.AuthenticationDaoStab;
import com.teamdev.services.UserDaoStab;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

class UserLogoutProcessUnitTest {

    @Test
    void logoutUserTest() throws DataAccessException {
        UserDaoStab userDao = new UserDaoStab();
        AuthenticationDaoStab authenticationDao = new AuthenticationDaoStab();
        UserLogoutProcessImpl logoutProcess = new UserLogoutProcessImpl(authenticationDao);

        RecordIdentifier<String> userId = new RecordIdentifier<>("user");
        String authToken = "token";

        userDao.create(new UserRecord(userId,
                                      "user",
                                      "password",
                                      "email@email.com"));

        authenticationDao.create(new AuthenticationRecord(userId,
                                                          authToken,
                                                          LocalDateTime.now()
                                                                       .plusDays(1)));

        logoutProcess.run(new UserLogoutCommand(userId, authToken));

        assertWithMessage("User logout failed.")
                .that(authenticationDao.authenticationsMap()
                                       .containsKey(userId))
                .isFalse();

    }

    @Test
    void logoutAbsentUser() throws DataAccessException {
        UserDaoStab userDao = new UserDaoStab();
        AuthenticationDaoStab authenticationDao = new AuthenticationDaoStab();
        UserLogoutProcessImpl logoutProcess = new UserLogoutProcessImpl(authenticationDao);

        RecordIdentifier<String> userId = new RecordIdentifier<>("user");
        String authToken = "token";

        assertThrows(DataAccessException.class,
                     () -> logoutProcess.run(new UserLogoutCommand(userId, authToken)));
    }

    @Test
    void nullTest() throws NoSuchMethodException {

        UserDaoStab dao = new UserDaoStab();
        AuthenticationDaoStab authenticationDao = new AuthenticationDaoStab();
        UserLogoutProcessImpl logoutProcess = new UserLogoutProcessImpl(authenticationDao);

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(logoutProcess, logoutProcess.getClass()
                                                      .getMethod("run",
                                                                 UserLogoutCommand.class));

    }
}
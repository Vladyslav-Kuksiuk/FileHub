package com.teamdev.processes.authentication;

import com.google.common.testing.NullPointerTester;
import com.teamdev.AuthenticationDaoStab;
import com.teamdev.UserDaoStab;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.util.StringEncryptor;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

public class UserAuthenticationProcessUnitTest {

    @Test
    void authorizationTest() throws DataAccessException {
        UserDaoStab userDao = new UserDaoStab();
        AuthenticationDaoStab authenticationDao = new AuthenticationDaoStab();
        UserAuthenticationProcessImpl authorizationProcess = new UserAuthenticationProcessImpl(
                userDao,
                authenticationDao);

        UserRecord user = new UserRecord(new RecordIdentifier<>("user"),
                                         "user",
                                         StringEncryptor.encrypt("password"),
                                         "email@email.com");

        userDao.create(user);

        UserAuthenticationCommand command = new UserAuthenticationCommand("user", "password");

        UserAuthenticationResponse response = authorizationProcess.run(command);

        assertWithMessage("User authorization failed.")
                .that(authenticationDao.authenticationsMap()
                                       .get(user.getId())
                                       .authenticationToken())
                .matches(response.authenticationToken());
    }

    @Test
    void nullTest() throws NoSuchMethodException {

        UserAuthenticationProcessImpl authorizationProcess = new UserAuthenticationProcessImpl(
                new UserDaoStab(),
                new AuthenticationDaoStab());

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(authorizationProcess, authorizationProcess.getClass()
                                                                    .getMethod("run",
                                                                               UserAuthenticationCommand.class));

    }

}

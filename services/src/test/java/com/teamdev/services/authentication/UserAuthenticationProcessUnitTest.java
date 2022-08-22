package com.teamdev.services.authentication;

import com.google.common.testing.NullPointerTester;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.services.AuthenticationDaoStab;
import com.teamdev.services.UserDaoStab;
import com.teamdev.util.StringEncryptor;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

public class UserAuthenticationProcessUnitTest {

    @Test
    void authorizationTest() throws DataAccessException {
        UserDaoStab userDao = new UserDaoStab();
        AuthenticationDaoStab authenticationDao = new AuthenticationDaoStab();
        UserAuthenticationProcess authorizationProcess = new UserAuthenticationProcess(userDao,
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

        UserAuthenticationProcess authorizationProcess = new UserAuthenticationProcess(
                new UserDaoStab(),
                new AuthenticationDaoStab());

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(authorizationProcess, authorizationProcess.getClass()
                                                                    .getMethod("run",
                                                                               UserAuthenticationCommand.class));

    }

}

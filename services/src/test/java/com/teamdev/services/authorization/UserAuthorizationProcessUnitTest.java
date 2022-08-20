package com.teamdev.services.authorization;

import com.google.common.testing.NullPointerTester;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.services.UserDaoStab;
import com.teamdev.util.StringEncryptor;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

public class UserAuthorizationProcessUnitTest {

    @Test
    void authorizationTest() throws DataAccessException {
        UserDaoStab dao = new UserDaoStab();
        UserAuthorizationProcess authorizationProcess = new UserAuthorizationProcess(dao);

        UserRecord user = new UserRecord(new RecordIdentifier<>("user"),
                                         "user",
                                         StringEncryptor.encrypt("password"),
                                         "email@email.com");

        dao.create(user);

        UserAuthorizationCommand command = new UserAuthorizationCommand("user", "password");

        UserAuthorizationResponse response = authorizationProcess.run(command);

        assertWithMessage("User authorization failed.")
                .that(dao.authorizationsMap()
                         .get(user.getId())
                         .authenticationToken())
                .matches(response.authenticationToken());
    }

    @Test
    void nullTest() throws NoSuchMethodException {

        UserAuthorizationProcess authorizationProcess = new UserAuthorizationProcess(
                new UserDaoStab());

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(authorizationProcess, authorizationProcess.getClass()
                                                                    .getMethod("run",
                                                                               UserAuthorizationCommand.class));

    }

}

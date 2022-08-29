package com.teamdev.processes.register;

import com.google.common.testing.NullPointerTester;
import com.teamdev.UserDaoStab;
import com.teamdev.persistent.dao.RecordIdentifier;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class UserRegistrationProcessUnitTest {

    @Test
    void registerTest() throws InterruptedException, UserAlreadyRegisteredException {

        UserDaoStab dao = new UserDaoStab();
        UserRegistrationProcessImpl registrationProcess = new UserRegistrationProcessImpl(dao);

        UserRegistrationCommand command = new UserRegistrationCommand("Hellamb",
                                                                      "password",
                                                                      "email@email.com");

        registrationProcess.run(command);
        assertWithMessage("User registration failed.")
                .that(dao.usersMap()
                         .get(new RecordIdentifier<>("Hellamb"))
                         .email())
                .matches("email@email.com");

        Thread.sleep(3000);
    }

    @Test
    void nullTest() throws NoSuchMethodException {

        UserDaoStab dao = new UserDaoStab();
        UserRegistrationProcessImpl registrationProcess = new UserRegistrationProcessImpl(dao);

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(registrationProcess,
                          registrationProcess.getClass()
                                             .getMethod("run",
                                                        UserRegistrationCommand.class));

    }

}
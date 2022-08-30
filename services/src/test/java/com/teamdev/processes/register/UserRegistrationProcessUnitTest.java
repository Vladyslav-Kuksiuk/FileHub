package com.teamdev.processes.register;

import com.google.common.testing.NullPointerTester;
import com.teamdev.UserDaoFake;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.util.StringEncryptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

class UserRegistrationProcessUnitTest {

    private UserDaoFake userDao;
    private UserRegistrationProcess registrationProcess;

    private UserRecord registeredUser;

    private UserRecord toRegisterUser;

    @BeforeEach
    void setUp() throws DataAccessException {
        userDao = new UserDaoFake();
        registrationProcess = new UserRegistrationProcessImpl(userDao);

        registeredUser = new UserRecord(new RecordId<>("user1"),
                                        "user1",
                                        StringEncryptor.encrypt("password1"),
                                        "email1@email.com");

        toRegisterUser = new UserRecord(new RecordId<>("user2"),
                                        "user2",
                                        StringEncryptor.encrypt("password2"),
                                        "email2@email.com");

        userDao.create(registeredUser);

    }

    @Test
    void registerTest() throws InterruptedException, UserAlreadyRegisteredException,
                               DataAccessException {

        UserRegistrationCommand command = new UserRegistrationCommand(toRegisterUser.login(),
                                                                      "password2",
                                                                      toRegisterUser.email());

        registrationProcess.handle(command);

        assertWithMessage("Registered user login not match.")
                .that(userDao.find(toRegisterUser.id())
                             .login())
                .matches(toRegisterUser.login());

        assertWithMessage("Registered user password cache not match.")
                .that(userDao.find(toRegisterUser.id())
                             .password())
                .matches(toRegisterUser.password());

        assertWithMessage("Registered user email not match.")
                .that(userDao.find(toRegisterUser.id())
                             .email())
                .matches(toRegisterUser.email());
    }

    @Test
    void registerExistingUserTest() {

        UserRegistrationCommand command = new UserRegistrationCommand(registeredUser.login(),
                                                                      "password1",
                                                                      registeredUser.email());

        assertThrows(UserAlreadyRegisteredException.class,
                     () -> registrationProcess.handle(command),
                     "Register user with same login not failed.");

    }

    @Test
    void nullTest() throws NoSuchMethodException {

        UserDaoFake dao = new UserDaoFake();
        UserRegistrationProcessImpl registrationProcess = new UserRegistrationProcessImpl(dao);

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(registrationProcess,
                          registrationProcess.getClass()
                                             .getMethod("handle",
                                                        UserRegistrationCommand.class));

    }

}
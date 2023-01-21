package com.teamdev.filehub.processes.user.authentication;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.AuthenticationDaoFake;
import com.teamdev.filehub.UserDaoFake;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.user.UserRecord;
import com.teamdev.util.StringEncryptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class UserAuthenticationProcessTest {

    private AuthenticationDaoFake authenticationDao;
    private UserAuthenticationProcess authenticationProcess;

    private UserRecord registeredUser;

    private UserRecord notRegisteredUser;

    @BeforeEach
    void setUp() {
        UserDaoFake userDao = new UserDaoFake();
        authenticationDao = new AuthenticationDaoFake();
        authenticationProcess = new UserAuthenticationProcessImpl(userDao,
                                                                  authenticationDao);

        registeredUser = new UserRecord(new RecordId("user1"),
                                        "user1",
                                        StringEncryptor.encrypt("password1"));

        notRegisteredUser = new UserRecord(new RecordId("user2"),
                                           "user2",
                                           StringEncryptor.encrypt("password2"));

        userDao.create(registeredUser);

    }

    @Test
    void authenticationTest() throws UserCredentialsMismatchException {

        UserAuthenticationCommand command = new UserAuthenticationCommand(registeredUser.login(),
                                                                          "password1");

        UserAuthenticationResponse response = authenticationProcess.handle(command);

        assertWithMessage("User authentication failed.")
                .that(authenticationDao.authenticationsMap()
                                       .values()
                              .stream()
                              .filter(authRecord -> authRecord.userId()
                                                              .equals(registeredUser.id()))
                              .findFirst()
                              .get()
                              .authenticationToken())
                .isEqualTo(response.authenticationToken());
    }

    @Test
    void loginMismatchTest() {

        UserAuthenticationCommand command = new UserAuthenticationCommand(notRegisteredUser.login(),
                                                                          "password1");

        assertThrows(UserCredentialsMismatchException.class,
                     () -> authenticationProcess.handle(command),
                     "User authentication with wrong login not failed.");
    }

    @Test
    void passwordMismatchTest() {

        UserAuthenticationCommand command = new UserAuthenticationCommand(registeredUser.login(),
                                                                          "password2");

        assertThrows(UserCredentialsMismatchException.class,
                     () -> authenticationProcess.handle(command),
                     "User authentication with wrong password not failed.");
    }

    @Test
    void nullTest() throws NoSuchMethodException {

        UserAuthenticationProcessImpl authenticationProcess = new UserAuthenticationProcessImpl(
                new UserDaoFake(),
                new AuthenticationDaoFake());

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(authenticationProcess,
                          authenticationProcess.getClass()
                                               .getMethod("handle",
                                                          UserAuthenticationCommand.class));

    }

}

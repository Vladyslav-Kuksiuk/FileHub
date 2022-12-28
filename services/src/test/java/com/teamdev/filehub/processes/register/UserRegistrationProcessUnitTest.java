package com.teamdev.filehub.processes.register;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.FolderDaoFake;
import com.teamdev.filehub.UserDaoFake;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.user.UserRecord;
import com.teamdev.util.StringEncryptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

class UserRegistrationProcessUnitTest {

    private UserDaoFake userDao;
    private FolderDaoFake folderDao;
    private UserRegistrationProcess registrationProcess;

    private UserRecord registeredUser;

    private UserRecord toRegisterUser;

    @BeforeEach
    void setUp() {
        userDao = new UserDaoFake();
        folderDao = new FolderDaoFake();
        registrationProcess = new UserRegistrationProcessImpl(userDao, folderDao);

        registeredUser = new UserRecord(new RecordId<>("email1@email.com"),
                                        "email1@email.com",
                                        StringEncryptor.encrypt("password1"));

        toRegisterUser = new UserRecord(new RecordId<>("email2@email.com"),
                                        "email2@email.com",
                                        StringEncryptor.encrypt("password2"));

        userDao.create(registeredUser);

    }

    @Test
    void registerTest() throws UserAlreadyRegisteredException {

        UserRegistrationCommand command = new UserRegistrationCommand(toRegisterUser.login(),
                                                                      "password2");

        registrationProcess.handle(command);

        assertWithMessage("Registered user login not match.")
                .that(userDao.find(toRegisterUser.id())
                             .get()
                             .login())
                .matches(toRegisterUser.login());

        assertWithMessage("Registered user password cache not match.")
                .that(userDao.find(toRegisterUser.id())
                             .get()
                             .password())
                .matches(toRegisterUser.password());

        assertWithMessage("Registered user root folder not exists.")
                .that(folderDao.find(new RecordId<>(toRegisterUser.login() + "_root"))
                               .get()
                               .ownerId())
                .isEqualTo(toRegisterUser.id());
    }

    @Test
    void registerExistingUserTest() {

        UserRegistrationCommand command = new UserRegistrationCommand(registeredUser.login(),
                                                                      "password1");

        assertThrows(UserAlreadyRegisteredException.class,
                     () -> registrationProcess.handle(command),
                     "Register user with same login not failed.");

    }

    @Test
    void nullTest() throws NoSuchMethodException {
        UserRegistrationProcessImpl registrationProcess = new UserRegistrationProcessImpl(userDao,
                                                                                          folderDao);

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(registrationProcess,
                          registrationProcess.getClass()
                                             .getMethod("handle",
                                                        UserRegistrationCommand.class));

    }

}

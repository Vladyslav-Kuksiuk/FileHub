package com.teamdev.filehub.processes.register;

import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.InMemoryFolderDao;
import com.teamdev.filehub.dao.user.InMemoryUserDao;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.ProcessException;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class UserRegistrationProcessIntegrationTest {

    private final InMemoryDatabase database;
    private final ApplicationProcess<UserRegistrationCommand, RecordId<String>> registerProcess;

    UserRegistrationProcessIntegrationTest() throws InterruptedException {
        database = new InMemoryDatabase();
        database.clean();

        UserDao userDao = new InMemoryUserDao(database.userTable());
        FolderDao folderDao = new InMemoryFolderDao(database.folderTable());

        registerProcess =
                new UserRegistrationProcessImpl(userDao, folderDao);

        Thread.sleep(1500);
    }

    @Test
    void registerTest() throws InterruptedException, ProcessException {
        UserRegistrationCommand command = new UserRegistrationCommand("Hellamb",
                                                                      "password",
                                                                      "email@email.com");

        registerProcess.handle(command);
        assertWithMessage("User registration failed.")
                .that(database.userTable()
                              .getDataById("Hellamb")
                              .get()
                              .email())
                .matches("email@email.com");

        Thread.sleep(1500);
    }

    @Test
    void registerManyTest() throws InterruptedException, ProcessException {

        for (int i = 0; i < 100; i++) {
            UserRegistrationCommand command = new UserRegistrationCommand("user" + i,
                                                                          "password",
                                                                          "email@email.com");

            registerProcess.handle(command);

            if (i % 25 == 0) {
                Thread.sleep(1000);
            }

        }
        assertWithMessage("User registration failed.")
                .that(database.userTable()
                              .getDataById("user99")
                              .get()
                              .email())
                .matches("email@email.com");

        Thread.sleep(1500);
    }

}
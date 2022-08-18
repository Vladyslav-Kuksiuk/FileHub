package com.teamdev.services.register;

import com.google.common.testing.NullPointerTester;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.user.InMemoryUserDao;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.services.ApplicationProcess;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserRegistrationProcessTest {

    private final InMemoryDatabase database = new InMemoryDatabase();
    private final UserDao userDao = new InMemoryUserDao(database);
    private final ApplicationProcess<UserRegistrationCommand> registerProcess = new UserRegistrationProcess(
            userDao);

    @Test
    void registerTest() throws DataAccessException, DatabaseTransactionException,
                               DatabaseException {
        database.clean();
        UserRegistrationCommand command = new UserRegistrationCommand("Hellamb",
                                                                      "password",
                                                                      "vlad.kuksiuk@gmail.com");

        registerProcess.run(command);
        assertEquals("vlad.kuksiuk@gmail.com", database.userTable()
                                                       .getUser("Hellamb")
                                                       .getEmail());
    }

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.testMethod(registerProcess, registerProcess.getClass()
                                                          .getMethod("run",
                                                                     UserRegistrationCommand.class));

    }

}
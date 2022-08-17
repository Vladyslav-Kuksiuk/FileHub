package com.teamdev.services.register;

import com.teamdev.persistent.dao.user.InMemoryUserDao;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.persistent.database.InMemoryDatabase;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserRegistrationProcessTest {

    private final InMemoryDatabase database = new InMemoryDatabase();
    private final UserDao userDao = new InMemoryUserDao(database);

    private final UserRegistrationProcess process = new UserRegistrationProcess(userDao);

    @Test
    void run() {
        UserRegistrationCommand command = new UserRegistrationCommand("Hellamb",
                                                                      "password",
                                                                      "vlad.kuksiuk@gmail.com");

        process.run(command);
        assertEquals("vlad.kuksiuk@gmail.com", database.userTable()
                                                       .getUser("Hellamb")
                                                       .getEmail());
    }
}
package com.teamdev.persistent.dao.user;

import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.database.InMemoryDatabase;
import com.teamdev.persistent.database.user.UserData;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class InMemoryUserDaoTest {

    private final InMemoryDatabase database = new InMemoryDatabase();
    private final InMemoryUserDao userDao = new InMemoryUserDao(database);

    InMemoryUserDaoTest() {
        UserData user1 = new UserData("login1", "password1", "email1@email.com");
        UserData user2 = new UserData("login2", "password2", "email2@email.com");
        UserData user3 = new UserData("login3", "password3", "email3@email.com");

        database.userTable().addUser(user1);
        database.userTable().addUser(user2);
        database.userTable().addUser(user3);
    }

    @Test
    void createTest() {
        UserRecord newUser = new UserRecord(new RecordIdentifier<>("login4"),
                                           "login4",
                                           "password4",
                                           "email4@email.com");

        userDao.create(newUser);

        assertEquals("password4", database.userTable().getUser("login4").getPassword());
    }

    @Test
    void findTest() {

        String email = userDao.find(new RecordIdentifier<>("login1"))
                              .getEmail();

        assertEquals("email1@email.com", email);
    }

    @Test
    void updateTest() {

        UserRecord updatedUser = new UserRecord(new RecordIdentifier<>("login2"),
                                            "login2",
                                            "password2",
                                            "changed@email.com");

        userDao.update(updatedUser);

        assertEquals("changed@email.com", database.userTable().getUser("login2").getEmail());
    }

    @Test
    void deleteTest() {

        userDao.delete(new RecordIdentifier<>("login3"));

        assertThrows(IllegalStateException.class, ()->database.userTable().getUser("login3"));

    }
}
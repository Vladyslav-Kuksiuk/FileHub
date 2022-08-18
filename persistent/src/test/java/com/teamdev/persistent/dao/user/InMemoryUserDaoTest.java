package com.teamdev.persistent.dao.user;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.user.UserData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class InMemoryUserDaoTest {

    private final InMemoryDatabase database = new InMemoryDatabase();
    private final InMemoryUserDao userDao = new InMemoryUserDao(database);

    InMemoryUserDaoTest() throws DatabaseTransactionException, DatabaseException {
        database.clean();
        UserData user1 = new UserData("login1", "password1", "email1@email.com");
        UserData user2 = new UserData("login2", "password2", "email2@email.com");
        UserData user3 = new UserData("login3", "password3", "email3@email.com");

            database.userTable()
                    .addUser(user1);
            database.userTable()
                    .addUser(user2);
            database.userTable()
                    .addUser(user3);
    }

    @Test
    void createTest() throws DataAccessException, DatabaseTransactionException {
        UserRecord newUser = new UserRecord(new RecordIdentifier<>("login4"),
                                            "login4",
                                            "password4",
                                            "email4@email.com");

        userDao.create(newUser);

        assertEquals("password4", database.userTable()
                                          .getUser("login4")
                                          .getPassword());
    }

    @Test
    void findTest() throws DataAccessException {

        String email = userDao.find(new RecordIdentifier<>("login1"))
                              .getEmail();

        assertEquals("email1@email.com", email);
    }

    @Test
    void updateTest() throws DatabaseTransactionException, DataAccessException {

        UserRecord updatedUser = new UserRecord(new RecordIdentifier<>("login2"),
                                                "login2",
                                                "password2",
                                                "changed@email.com");

        userDao.update(updatedUser);

        assertEquals("changed@email.com", database.userTable()
                                                  .getUser("login2")
                                                  .getEmail());
    }

    @Test
    void deleteTest() throws DataAccessException {

        userDao.delete(new RecordIdentifier<>("login3"));

        assertThrows(DatabaseTransactionException.class, () -> database.userTable()
                                                                .getUser("login3"));

    }
}
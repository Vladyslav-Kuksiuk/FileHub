package com.teamdev.persistent.dao.user;

import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.user.UserData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class InMemoryUserDaoTest {

    private final InMemoryDatabase database = new InMemoryDatabase();
    private final InMemoryUserDao userDao = new InMemoryUserDao(database);

    InMemoryUserDaoTest() throws DatabaseTransactionException, DatabaseException {
        database.clean();
        UserData user1 = new UserData("login1", "login1", "password1", "email1@email.com");
        UserData user2 = new UserData("login2", "login2", "password2", "email2@email.com");
        UserData user3 = new UserData("login3", "login3", "password3", "email3@email.com");

        database.userTable()
                .addData(user1);
        database.userTable()
                .addData(user2);
        database.userTable()
                .addData(user3);
    }

    @Test
    void createTest() throws DataAccessException, DatabaseTransactionException {
        UserRecord newUser = new UserRecord(new RecordId<>("login4"),
                                            "login4",
                                            "password4",
                                            "email4@email.com");

        userDao.create(newUser);

        assertEquals("password4", database.userTable()
                                          .getDataById("login4")
                                          .password());
    }

    @Test
    void createExistingUserTest() {

        assertThrows(DataAccessException.class,
                     () -> userDao.create(new UserRecord(new RecordId<>("login1"),
                                                         "login1",
                                                         "password",
                                                         "email@email.com")),
                     "Create already existing user not failed.");

    }

    @Test
    void findTest() throws DataAccessException {

        String email = userDao.find(new RecordId<>("login1"))
                              .email();

        assertEquals("email1@email.com", email);
    }

    @Test
    void findAbsentTest() {

        assertThrows(DataAccessException.class,
                     () -> userDao.find(new RecordId<>("notLogin")),
                     "Find absent user not failed.");

    }

    @Test
    void updateTest() throws DatabaseTransactionException, DataAccessException {

        UserRecord updatedUser = new UserRecord(new RecordId<>("login2"),
                                                "login2",
                                                "password2",
                                                "changed@email.com");

        userDao.update(updatedUser);

        assertEquals("changed@email.com", database.userTable()
                                                  .getDataById("login2")
                                                  .email());
    }

    @Test
    void updateAbsentTest() {

        assertThrows(DataAccessException.class,
                     () -> {
                         userDao.update(new UserRecord(new RecordId<>("notLogin"),
                                                       "notLogin",
                                                       "password",
                                                       "email@email.com"));
                     }, "Update absent user not failed.");

    }

    @Test
    void deleteTest() throws DataAccessException {

        userDao.delete(new RecordId<>("login3"));

        assertThrows(DatabaseTransactionException.class, () -> database.userTable()
                                                                       .getDataById("login3"));

    }

    @Test
    void deleteAbsentTest() {

        assertThrows(DataAccessException.class,
                     () -> {
                         userDao.delete(new RecordId<>("notLogin"));
                     }, "Delete absent user not failed.");

    }
}
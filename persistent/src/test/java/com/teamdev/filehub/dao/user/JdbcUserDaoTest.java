package com.teamdev.filehub.dao.user;

import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

import static com.google.common.truth.Truth.assertWithMessage;

class JdbcUserDaoTest {

    static final String DB_URL = "jdbc:postgresql://127.0.0.1:5432/FileHub";
    static final String DB_USER = "postgres";
    static final String DB_PASS = "admin";
    private final UserRecord USER = new UserRecord(new RecordId<>("user"),
                                                   "user",
                                                   "password");
    private UserDao userDao;
    private Connection dbConnection;
    private Statement dbStatement;

    @BeforeEach
    void setUp() {
        try {
            dbConnection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            dbStatement = dbConnection.createStatement();
            userDao = new JdbcUserDao(dbStatement, "users");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void createTest() throws SQLException {

        userDao.create(USER);

        ResultSet resultSet = dbStatement.executeQuery(
                "SELECT * FROM users WHERE id = 'user'");
        resultSet.next();
        assertWithMessage("User creation failed.")
                .that(resultSet.getString(3))
                .matches(USER.password());

    }

    @Test
    void findTest() throws SQLException {

        dbStatement.execute("INSERT INTO users (id,login,password,email)" +
                                    "VALUES ('user', 'user', 'password', 'email@email.com');");

        Optional<UserRecord> userRecord = userDao.find(USER.id());

        assertWithMessage("User creation failed.")
                .that(userRecord.get()
                                .password())
                .matches(USER.password());

    }

    @AfterEach
    void tearDown() throws SQLException {
        dbStatement.execute("TRUNCATE TABLE users");
    }
}

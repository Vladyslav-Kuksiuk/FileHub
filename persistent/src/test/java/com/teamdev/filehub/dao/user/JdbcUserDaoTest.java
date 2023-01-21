package com.teamdev.filehub.dao.user;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

class JdbcUserDaoTest {

    private final String tableName = "tableName";

    @Mock
    private Statement dbStatement;

    @Mock
    private ResultSet resultSet;

    JdbcUserDaoTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();
        tester.testAllPublicConstructors(JdbcUserDao.class);

    }

    @Test
    @DisplayName("Should  return optional with user record")
    void testFindByLoginWithFoundedUser() throws SQLException {

        UserRecord userRecord = new UserRecord(
                new RecordId("userId"),
                "login",
                "password");

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE login = '%s'",
                                              tableName,
                                              userRecord.login());

        Mockito.when(dbStatement.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(true);
        Mockito.when(resultSet.getString(1))
               .thenReturn(userRecord.id()
                                     .value());
        Mockito.when(resultSet.getString(2))
               .thenReturn(userRecord.login());
        Mockito.when(resultSet.getString(3))
               .thenReturn(userRecord.password());

        var userDao = new JdbcUserDao(dbStatement, tableName);

        assertThat(userDao.findByLogin(userRecord.login()))
                .isEqualTo(Optional.of(userRecord));

    }

    @Test
    @DisplayName("Should  return optional empty when result set is empty")
    void testFindByLoginWithoutFoundedUser() throws SQLException {

        String login = "login";

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE login = '%s'",
                                              tableName,
                                              login);

        Mockito.when(dbStatement.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(false);

        var userDao = new JdbcUserDao(dbStatement, tableName);

        assertThat(userDao.findByLogin(login))
                .isEqualTo(Optional.empty());

    }

    @Test
    @DisplayName("Should throw RuntimeException when catch SQLException")
    void testFindByLoginWithSQLException() throws SQLException {

        String login = "login";

        Mockito.when(dbStatement.executeQuery(any()))
               .thenThrow(new SQLException("exception"));

        Mockito.when(resultSet.next())
               .thenReturn(false);

        var userDao = new JdbcUserDao(dbStatement, tableName);

        assertThrows(RuntimeException.class, () -> userDao.findByLogin(login));

    }

}

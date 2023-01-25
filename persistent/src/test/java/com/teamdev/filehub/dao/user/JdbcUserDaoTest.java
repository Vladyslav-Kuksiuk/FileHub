package com.teamdev.filehub.dao.user;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.DbConnection;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

class JdbcUserDaoTest {

    private final String tableName = "tableName";

    @Mock
    private DbConnection dbConnection;

    @Mock
    private ResultSet resultSet;

    JdbcUserDaoTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();
        tester.setDefault(DbConnection.class, Mockito.mock(DbConnection.class));
        tester.testAllPublicConstructors(JdbcUserDao.class);

    }

    @Test
    @DisplayName("Should return optional with user record")
    void testFindByLoginWithFoundedUser() throws SQLException {

        UserRecord userRecord = new UserRecord(
                new RecordId("userId"),
                "login",
                "password");

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE login = '%s'",
                                              tableName,
                                              userRecord.login());

        Mockito.when(dbConnection.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(true);
        Mockito.when(resultSet.getString("id"))
               .thenReturn(userRecord.id()
                                     .value());
        Mockito.when(resultSet.getString("login"))
               .thenReturn(userRecord.login());
        Mockito.when(resultSet.getString("password"))
               .thenReturn(userRecord.password());

        var userDao = new JdbcUserDao(dbConnection, tableName);

        assertThat(userDao.findByLogin(userRecord.login()))
                .isEqualTo(Optional.of(userRecord));

    }

    @Test
    @DisplayName("Should return optional empty when result set is empty")
    void testFindByLoginWithoutFoundedUser() throws SQLException {

        Mockito.when(dbConnection.executeQuery(any()))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(false);

        var userDao = new JdbcUserDao(dbConnection, tableName);

        assertThat(userDao.findByLogin("login"))
                .isEqualTo(Optional.empty());

    }

    @Test
    @DisplayName("Should throw RuntimeException when catch SQLException")
    void testFindByLoginWithSQLException() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.next())
               .thenThrow(new SQLException(""));

        Mockito.when(dbConnection.executeQuery(any()))
               .thenReturn(resultSet);

        var userDao = new JdbcUserDao(dbConnection, tableName);

        assertThrows(RuntimeException.class, () -> userDao.findByLogin("login"));

    }

}

package com.teamdev.filehub.dao.authentication;

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
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

class JdbcAuthenticationDaoTest {

    private final String tableName = "tableName";

    @Mock
    private DbConnection dbConnection;

    @Mock
    private ResultSet resultSet;

    JdbcAuthenticationDaoTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();
        tester.setDefault(DbConnection.class, Mockito.mock(DbConnection.class));
        tester.testAllPublicConstructors(JdbcAuthenticationDao.class);

    }

    @Test
    @DisplayName("Should return optional with authentication record")
    void testFindByTokenWithFoundedAuthentication() throws SQLException {

        var authRecord = new AuthenticationRecord(
                new RecordId("auth_id"),
                "token",
                LocalDateTime.of(10, 10, 10, 10, 10),
                new RecordId("user"));

        var selectSqlQuery = String.format("SELECT * FROM %s WHERE authentication_token = '%s'",
                                           tableName,
                                           authRecord.authenticationToken());

        Mockito.when(dbConnection.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(true);

        Mockito.when(resultSet.getString("id"))
               .thenReturn(authRecord.id()
                                     .value());

        Mockito.when(resultSet.getString("authentication_token"))
               .thenReturn(authRecord.authenticationToken());

        Mockito.when(resultSet.getTimestamp("expire_time"))
               .thenReturn(Timestamp.valueOf(authRecord.expireTime()));

        Mockito.when(resultSet.getString("user_id"))
               .thenReturn(authRecord.userId()
                                     .value());

        var authDao = new JdbcAuthenticationDao(dbConnection, tableName);

        assertThat(authDao.findByToken(authRecord.authenticationToken()))
                .isEqualTo(Optional.of(authRecord));

    }

    @Test
    @DisplayName("Should return optional empty when result set is empty")
    void testFindByTokenWithoutFoundedAuthentication() throws SQLException {

        Mockito.when(dbConnection.executeQuery(any()))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(false);

        var authDao = new JdbcAuthenticationDao(dbConnection, tableName);

        assertThat(authDao.findByToken("token"))
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

        var authDao = new JdbcAuthenticationDao(dbConnection, tableName);

        assertThrows(RuntimeException.class, () -> authDao.findByToken("token"));

    }

}

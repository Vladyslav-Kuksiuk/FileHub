package com.teamdev.filehub.dao.authentication;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SqlAuthenticationConverterTest {

    private final AuthenticationRecord authRecord = new AuthenticationRecord(
            new RecordId("auth_id"),
            "token",
            LocalDateTime.of(10, 10, 10, 10, 10),
            new RecordId("user"));

    private final String tableName = "tableName";

    private final SqlAuthenticationConverter sqlAuthConverter = new SqlAuthenticationConverter(
            tableName);

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();
        tester.testAllPublicConstructors(SqlAuthenticationConverter.class);

    }

    @Test
    @DisplayName("Should return SQL code to insert record in table")
    void testRecordInsertSql() {

        var insertSql = String.format(
                "INSERT INTO %s (id, authentication_token, expire_time, user_id)" +
                        "VALUES('%s','%s','%s', '%s')",
                tableName,
                authRecord.id()
                          .value(),
                authRecord.authenticationToken(),
                Timestamp.valueOf(authRecord.expireTime()),
                authRecord.userId()
                          .value());

        assertThat(sqlAuthConverter.recordInsertSql(authRecord))
                .isEqualTo(insertSql);

    }

    @Test
    @DisplayName("Should return SQL code to update record in table")
    void testRecordUpdateSql() {

        var updateSql = String.format("UPDATE %s" +
                                              "SET" +
                                              "authentication_token = '%s'" +
                                              "expire_time = '%s'" +
                                              "user_id = '%s'" +
                                              "WHERE id = '%s'",
                                      tableName,
                                      authRecord.authenticationToken(),
                                      Timestamp.valueOf(authRecord.expireTime()),
                                      authRecord.userId()
                                                .value(),
                                      authRecord.id()
                                                .value());

        assertThat(sqlAuthConverter.recordUpdateSql(authRecord))
                .isEqualTo(updateSql);

    }

    @Test
    @DisplayName("Should get authentication record from result set")
    void testResultSetToRecordWithoutExceptions() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);

        Mockito.when(resultSet.getString(1))
               .thenReturn(authRecord.id()
                                     .value());

        Mockito.when(resultSet.getString(2))
               .thenReturn(authRecord.authenticationToken());

        Mockito.when(resultSet.getTimestamp(3))
               .thenReturn(Timestamp.valueOf(authRecord.expireTime()));

        Mockito.when(resultSet.getString(4))
               .thenReturn(authRecord.userId()
                                     .value());

        assertThat(sqlAuthConverter.resultSetToRecord(resultSet))
                .isEqualTo(authRecord);

    }

    @Test
    @DisplayName("Should throw RuntimeException on SQLException in result set.")
    void testResultSetToRecordWithSQLException() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.getString(1))
               .thenThrow(new SQLException(""));

        assertThrows(RuntimeException.class, () -> {
            sqlAuthConverter.resultSetToRecord(resultSet);
        });
    }

}

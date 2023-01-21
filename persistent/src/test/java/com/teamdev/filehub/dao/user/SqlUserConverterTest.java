package com.teamdev.filehub.dao.user;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.sql.ResultSet;
import java.sql.SQLException;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SqlUserConverterTest {

    private final UserRecord userRecord = new UserRecord(
            new RecordId("userId"),
            "login",
            "password");

    private final String tableName = "tableName";

    private final SqlUserConverter sqlUserConverter = new SqlUserConverter(tableName);

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();
        tester.testAllPublicConstructors(SqlUserConverter.class);

    }

    @Test
    @DisplayName("Should return SQL code to insert record in table")
    void testRecordInsertSql() {

        var insertSql = String.format("INSERT INTO %s (id, login, password)" +
                                              "VALUES('%s','%s','%s')",
                                      tableName,
                                      userRecord.id()
                                                .value(),
                                      userRecord.login(),
                                      userRecord.password());

        assertThat(sqlUserConverter.recordInsertSql(userRecord))
                .isEqualTo(insertSql);

    }

    @Test
    @DisplayName("Should return SQL code to update record in table")
    void testRecordUpdateSql() {

        var updateSql = String.format("UPDATE %s" +
                                              "SET" +
                                              "login = '%s'" +
                                              "password = '%s'" +
                                              "WHERE id = '%s'",
                                      tableName,
                                      userRecord.login(),
                                      userRecord.password(),
                                      userRecord.id()
                                                .value());

        assertThat(sqlUserConverter.recordUpdateSql(userRecord))
                .isEqualTo(updateSql);

    }

    @Test
    @DisplayName("Should get user record from result set")
    void testResultSetToRecordWithoutExceptions() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.getString(1))
               .thenReturn(userRecord.id()
                                     .value());
        Mockito.when(resultSet.getString(2))
               .thenReturn(userRecord.login());
        Mockito.when(resultSet.getString(3))
               .thenReturn(userRecord.password());

        assertThat(sqlUserConverter.resultSetToRecord(resultSet))
                .isEqualTo(userRecord);

    }

    @Test
    @DisplayName("Should throw RuntimeException on SQLException in result set.")
    void testResultSetToRecordWithSQLException() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.getString(1))
               .thenThrow(new SQLException(""));

        assertThrows(RuntimeException.class, () -> {
            sqlUserConverter.resultSetToRecord(resultSet);
        });
    }

}

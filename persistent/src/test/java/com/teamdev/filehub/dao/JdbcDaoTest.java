package com.teamdev.filehub.dao;

import com.google.common.testing.NullPointerTester;
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

class JdbcDaoTest {

    private final String tableName = "tableName";

    private final DatabaseRecord record = new DatabaseRecord(new RecordId("recordId"));

    @Mock
    private Statement dbStatement;

    @Mock
    private SqlRecordConverter<DatabaseRecord> converter;

    JdbcDaoTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(JdbcDaoTest.class);
    }

    @Test
    @DisplayName("Should successfully execute select query and convert result set into record")
    void testFindWithFoundedRecord() throws SQLException {

        var dao = new JdbcDao<>(
                tableName,
                dbStatement,
                converter);

        var selectSqlQuery = String.format("SELECT * FROM %s WHERE id = '%s'",
                                           tableName,
                                           record.id()
                                                 .value());

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.next())
               .thenReturn(true);

        Mockito.when(dbStatement.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        Mockito.when(converter.resultSetToRecord(resultSet))
               .thenReturn(record);

        assertThat(dao.find(record.id()))
                .isEqualTo(Optional.of(record));
    }

    @Test
    @DisplayName("Should successfully execute select query and return Optional.empty() when result set is empty")
    void testFindWithoutFoundedRecord() throws SQLException {

        var dao = new JdbcDao<>(
                tableName,
                dbStatement,
                converter);

        var selectSqlQuery = String.format("SELECT * FROM %s WHERE id = '%s'",
                                           tableName,
                                           record.id()
                                                 .value());

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.next())
               .thenReturn(false);

        Mockito.when(dbStatement.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        assertThat(dao.find(record.id()))
                .isEqualTo(Optional.empty());
    }

    @Test
    @DisplayName("Should throw RuntimeException on SQLException when executing select query")
    void testFindWithSQLException() throws SQLException {

        var dao = new JdbcDao<>(
                tableName,
                dbStatement,
                converter);

        Mockito.when(dbStatement.execute(any()))
               .thenThrow(new SQLException(""));

        assertThrows(RuntimeException.class, () -> {
            dao.find(record.id());
        });
    }

    @Test
    @DisplayName("Should successfully execute delete query")
    void testDeleteWithoutExceptions() throws SQLException {

        var dao = new JdbcDao<>(
                tableName,
                dbStatement,
                converter);

        var deleteSqlQuery = String.format("DELETE FROM %s WHERE id = '%s'",
                                           tableName,
                                           record.id()
                                                 .value());

        dao.delete(record.id());

        Mockito.verify(dbStatement, Mockito.times(1))
               .execute(deleteSqlQuery);
    }

    @Test
    @DisplayName("Should throw RuntimeException on SQLException when executing delete query")
    void testDeleteWithSQLException() throws SQLException {

        var dao = new JdbcDao<>(
                tableName,
                dbStatement,
                converter);

        Mockito.when(dbStatement.execute(any()))
               .thenThrow(new SQLException(""));

        assertThrows(RuntimeException.class, () -> {
            dao.delete(record.id());
        });
    }

    @Test
    @DisplayName("Should successfully execute insert query")
    void testCreateWithoutExceptions() throws SQLException {

        var dao = new JdbcDao<>(
                tableName,
                dbStatement,
                converter);

        var createSqlQuery = "insert sql query";

        Mockito.when(converter.recordInsertSql(record))
               .thenReturn(createSqlQuery);

        dao.create(record);

        Mockito.verify(dbStatement, Mockito.times(1))
               .execute(createSqlQuery);
    }

    @Test
    @DisplayName("Should throw RuntimeException on SQLException when executing insert query")
    void testCreateWithSQLException() throws SQLException {

        var dao = new JdbcDao<>(
                tableName,
                dbStatement,
                converter);

        Mockito.when(dbStatement.execute(any()))
               .thenThrow(new SQLException(""));

        assertThrows(RuntimeException.class, () -> {
            dao.create(record);
        });
    }

    @Test
    @DisplayName("Should successfully execute update query")
    void testUpdateWithoutExceptions() throws SQLException {

        var dao = new JdbcDao<>(
                tableName,
                dbStatement,
                converter);

        var createSqlQuery = "update sql query";

        Mockito.when(converter.recordUpdateSql(record))
               .thenReturn(createSqlQuery);

        dao.update(record);

        Mockito.verify(dbStatement, Mockito.times(1))
               .execute(createSqlQuery);
    }

    @Test
    @DisplayName("Should throw RuntimeException on SQLException when executing update query")
    void testUpdateWithSQLException() throws SQLException {

        var dao = new JdbcDao<>(
                tableName,
                dbStatement,
                converter);

        Mockito.when(dbStatement.execute(any()))
               .thenThrow(new SQLException(""));

        assertThrows(RuntimeException.class, () -> {
            dao.update(record);
        });
    }

}

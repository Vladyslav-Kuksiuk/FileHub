package com.teamdev.filehub.dao.file;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.sql.ResultSet;
import java.sql.SQLException;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SqlFileConverterTest {

    private final FileRecord fileRecord = new FileRecord(
            new RecordId("fileId"),
            new RecordId("folderId"),
            new RecordId("userId"),
            "fileName",
            "mimetype",
            123);

    private final String tableName = "tableName";

    private final SqlFileConverter sqlFileConverter = new SqlFileConverter(tableName);

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();
        tester.testAllPublicConstructors(SqlFileConverter.class);

    }

    @Test
    @DisplayName("Should return SQL code to insert record in table")
    void testRecordInsertSql() {

        var insertSql = String.format(
                "INSERT INTO %s (id, folder_id, owner_id, name, mimetype, size)" +
                        "VALUES('%s','%s', '%s','%s','%s','%o')",
                tableName,
                fileRecord.id()
                          .value(),
                fileRecord.folderId()
                          .value(),
                fileRecord.ownerId()
                          .value(),
                fileRecord.name(),
                fileRecord.mimetype(),
                fileRecord.size());

        assertThat(sqlFileConverter.recordInsertSql(fileRecord))
                .isEqualTo(insertSql);

    }

    @Test
    @DisplayName("Should return SQL code to update record in table")
    void testRecordUpdateSql() {

        var updateSql = String.format("UPDATE %s" +
                                              "SET" +
                                              "folder_id = '%s'" +
                                              "owner_id = '%s'" +
                                              "name = '%s'" +
                                              "mimetype = '%s'" +
                                              "size = '%o'" +
                                              "WHERE id = '%s'",
                                      tableName,
                                      fileRecord.folderId()
                                                .value(),
                                      fileRecord.ownerId()
                                                .value(),
                                      fileRecord.name(),
                                      fileRecord.mimetype(),
                                      fileRecord.size(),
                                      fileRecord.id()
                                                .value());

        assertThat(sqlFileConverter.recordUpdateSql(fileRecord))
                .isEqualTo(updateSql);

    }

    @Test
    @DisplayName("Should get folder record from result set")
    void testResultSetToRecordWithoutExceptions() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.getString(1))
               .thenReturn(fileRecord.id()
                                     .value());
        Mockito.when(resultSet.getString(2))
               .thenReturn(fileRecord.folderId()
                                     .value());
        Mockito.when(resultSet.getString(3))
               .thenReturn(fileRecord.ownerId()
                                     .value());
        Mockito.when(resultSet.getString(4))
               .thenReturn(fileRecord.name());
        Mockito.when(resultSet.getString(5))
               .thenReturn(fileRecord.mimetype());
        Mockito.when(resultSet.getLong(6))
               .thenReturn(fileRecord.size());

        assertThat(sqlFileConverter.resultSetToRecord(resultSet))
                .isEqualTo(fileRecord);

    }

    @Test
    @DisplayName("Should throw RuntimeException on SQLException in result set.")
    void testResultSetToRecordWithSQLException() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.getString(1))
               .thenThrow(new SQLException(""));

        assertThrows(RuntimeException.class, () -> {
            sqlFileConverter.resultSetToRecord(resultSet);
        });
    }

}

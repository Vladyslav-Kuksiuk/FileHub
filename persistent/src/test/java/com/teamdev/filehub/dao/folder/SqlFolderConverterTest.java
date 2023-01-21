package com.teamdev.filehub.dao.folder;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.sql.ResultSet;
import java.sql.SQLException;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SqlFolderConverterTest {

    private final FolderRecord folderRecord = new FolderRecord(
            new RecordId("folderId"),
            new RecordId("ownerId"),
            new RecordId("parentFolderId"),
            "name");

    private final String tableName = "tableName";

    private final SqlFolderConverter sqlFolderConverter = new SqlFolderConverter(tableName);

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();
        tester.testAllPublicConstructors(SqlFolderConverter.class);

    }

    @Test
    @DisplayName("Should return SQL code to insert record in table")
    void testRecordInsertSql() {

        var insertSql = String.format("INSERT INTO %s (id, owner_id, parent_folder_id, name)" +
                                              "VALUES('%s','%s', '%s','%s')",
                                      tableName,
                                      folderRecord.id()
                                                  .value(),
                                      folderRecord.ownerId()
                                                  .value(),
                                      folderRecord.parentFolderId()
                                                  .value(),
                                      folderRecord.name());

        assertThat(sqlFolderConverter.recordInsertSql(folderRecord))
                .isEqualTo(insertSql);

    }

    @Test
    @DisplayName("Should return SQL code to update record in table")
    void testRecordUpdateSql() {

        var updateSql = String.format("UPDATE %s" +
                                              "SET" +
                                              "owner_id = '%s'" +
                                              "parent_folder_id = '%s'" +
                                              "name = '%s'" +
                                              "WHERE id = '%s'",
                                      tableName,
                                      folderRecord.ownerId()
                                                  .value(),
                                      folderRecord.parentFolderId()
                                                  .value(),
                                      folderRecord.name(),
                                      folderRecord.id()
                                                  .value());

        assertThat(sqlFolderConverter.recordUpdateSql(folderRecord))
                .isEqualTo(updateSql);

    }

    @Test
    @DisplayName("Should get folder record from result set")
    void testResultSetToRecordWithoutExceptions() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.getString(1))
               .thenReturn(folderRecord.id()
                                       .value());
        Mockito.when(resultSet.getString(2))
               .thenReturn(folderRecord.ownerId()
                                       .value());
        Mockito.when(resultSet.getString(3))
               .thenReturn(folderRecord.parentFolderId()
                                       .value());
        Mockito.when(resultSet.getString(4))
               .thenReturn(folderRecord.name());

        assertThat(sqlFolderConverter.resultSetToRecord(resultSet))
                .isEqualTo(folderRecord);

    }

    @Test
    @DisplayName("Should throw RuntimeException on SQLException in result set.")
    void testResultSetToRecordWithSQLException() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.getString(1))
               .thenThrow(new SQLException(""));

        assertThrows(RuntimeException.class, () -> {
            sqlFolderConverter.resultSetToRecord(resultSet);
        });
    }

}

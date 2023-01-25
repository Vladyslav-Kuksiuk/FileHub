package com.teamdev.filehub.dao.file;

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
import java.util.List;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

class JdbcFileDaoTest {

    private final String tableName = "tableName";

    private final FileRecord fileRecord = new FileRecord(
            new RecordId("fileId"),
            new RecordId("folderId"),
            new RecordId("userId"),
            "fileName",
            "mimetype",
            123);

    @Mock
    private DbConnection dbConnection;

    @Mock
    private ResultSet resultSet;

    JdbcFileDaoTest() {
        MockitoAnnotations.openMocks(this);
    }

    private static void addFileRecordInResultSet(ResultSet resultSet,
                                                 FileRecord fileRecord) throws SQLException {
        Mockito.when(resultSet.getString("id"))
               .thenReturn(fileRecord.id()
                                     .value());
        Mockito.when(resultSet.getString("folder_id"))
               .thenReturn(fileRecord.folderId()
                                     .value());
        Mockito.when(resultSet.getString("owner_id"))
               .thenReturn(fileRecord.ownerId()
                                     .value());
        Mockito.when(resultSet.getString("name"))
               .thenReturn(fileRecord.name());
        Mockito.when(resultSet.getString("mimetype"))
               .thenReturn(fileRecord.mimetype());
        Mockito.when(resultSet.getLong("size"))
               .thenReturn(fileRecord.size());
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();
        tester.setDefault(DbConnection.class, Mockito.mock(DbConnection.class));
        tester.testAllPublicConstructors(JdbcFileDao.class);

    }

    @Test
    @DisplayName("Should throw RuntimeException when catch SQLException in getByFolderId")
    void testGetByFolderIdWithSQLException() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.next())
               .thenThrow(new SQLException(""));

        Mockito.when(dbConnection.executeQuery(any()))
               .thenReturn(resultSet);

        var fileDao = new JdbcFileDao(dbConnection, tableName);

        assertThrows(RuntimeException.class,
                     () -> fileDao.getByFolderId(new RecordId("folderId")));

    }

    @Test
    @DisplayName("Should return list of file records with same folder id")
    void testGetByFolderIdWithFoundedFile() throws SQLException {

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE folder_id = '%s'",
                                              tableName,
                                              fileRecord.folderId()
                                                        .value());

        Mockito.when(dbConnection.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(true, false);

        addFileRecordInResultSet(resultSet, fileRecord);

        var fileDao = new JdbcFileDao(dbConnection, tableName);

        assertThat(fileDao.getByFolderId(fileRecord.folderId()))
                .isEqualTo(List.of(fileRecord));

    }

    @Test
    @DisplayName("Should throw RuntimeException when catch SQLException in getByFolderIdAndNamePart")
    void testGetByFolderIdAndNamePartWithSQLException() throws SQLException {

        var resultSet = Mockito.mock(ResultSet.class);
        Mockito.when(resultSet.next())
               .thenThrow(new SQLException(""));

        Mockito.when(dbConnection.executeQuery(any()))
               .thenReturn(resultSet);

        var fileDao = new JdbcFileDao(dbConnection, tableName);

        assertThrows(RuntimeException.class,
                     () -> fileDao.getByFolderIdAndNamePart(new RecordId("folderId"), "namePart"));

    }

    @Test
    @DisplayName("Should return list of file records with same folder id and with same name part")
    void testGetByFolderIdAndNamePartWithFoundedFile() throws SQLException {

        var namePart = "namePart";

        var selectSqlQuery = String.format(
                "SELECT * FROM %s WHERE folder_id = '%s' AND name ILIKE '%s'",
                tableName,
                fileRecord.folderId()
                          .value(),
                namePart);

        Mockito.when(dbConnection.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(true, false);

        addFileRecordInResultSet(resultSet, fileRecord);

        var fileDao = new JdbcFileDao(dbConnection, tableName);

        assertThat(fileDao.getByFolderIdAndNamePart(fileRecord.folderId(), namePart))
                .isEqualTo(List.of(fileRecord));

    }

}

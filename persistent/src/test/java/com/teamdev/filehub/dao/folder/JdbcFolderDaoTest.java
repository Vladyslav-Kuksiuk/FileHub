package com.teamdev.filehub.dao.folder;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.user.JdbcUserDao;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

class JdbcFolderDaoTest {

    private final String tableName = "tableName";

    private final FolderRecord folderRecord = new FolderRecord(
            new RecordId("folderId"),
            new RecordId("userId"),
            new RecordId("parentFolderId"),
            "folderName");

    @Mock
    private Statement dbStatement;

    @Mock
    private ResultSet resultSet;

    JdbcFolderDaoTest() {
        MockitoAnnotations.openMocks(this);
    }

    private static void addFolderRecordInResultSet(ResultSet resultSet,
                                                   FolderRecord folderRecord) throws SQLException {
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
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();
        tester.testAllPublicConstructors(JdbcUserDao.class);

    }

    @Test
    @DisplayName("Should return optional with folder record")
    void testFindUserRootFolderWithFoundedFolder() throws SQLException {

        String selectSqlQuery = String.format(
                "SELECT * FROM %s WHERE owner_id = '%s' AND parent_folder_id IS NULL",
                tableName,
                folderRecord.ownerId()
                            .value());

        Mockito.when(dbStatement.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(true);

        addFolderRecordInResultSet(resultSet, folderRecord);

        var folderDao = new JdbcFolderDao(dbStatement, tableName);

        assertThat(folderDao.findUserRootFolder(folderRecord.ownerId()))
                .isEqualTo(Optional.of(folderRecord));

    }

    @Test
    @DisplayName("Should return optional empty when result set is empty")
    void testFindUserRootFolderWithoutFoundedFolder() throws SQLException {

        Mockito.when(dbStatement.executeQuery(any()))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(false);

        var folderDao = new JdbcFolderDao(dbStatement, tableName);

        assertThat(folderDao.findUserRootFolder(new RecordId("userId")))
                .isEqualTo(Optional.empty());

    }

    @Test
    @DisplayName("Should throw RuntimeException when catch SQLException")
    void testFindByLoginWithSQLException() throws SQLException {

        Mockito.when(dbStatement.executeQuery(any()))
               .thenThrow(new SQLException("exception"));

        var folderDao = new JdbcFolderDao(dbStatement, tableName);

        assertThrows(RuntimeException.class,
                     () -> folderDao.findUserRootFolder(new RecordId("userid")));

    }

    @Test
    @DisplayName("Should return list of folder records with same parent id")
    void testGetByParentIdWithFoundedFolder() throws SQLException {

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE parent_folder_id = '%s'",
                                              tableName,
                                              folderRecord.parentFolderId()
                                                          .value());

        Mockito.when(dbStatement.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(true, false);

        addFolderRecordInResultSet(resultSet, folderRecord);

        var folderDao = new JdbcFolderDao(dbStatement, tableName);

        assertThat(folderDao.getByParentId(folderRecord.parentFolderId()))
                .isEqualTo(List.of(folderRecord));

    }

    @Test
    @DisplayName("Should throw RuntimeException when catch SQLException")
    void testGetByParentIdWithSQLException() throws SQLException {

        Mockito.when(dbStatement.executeQuery(any()))
               .thenThrow(new SQLException("exception"));

        var folderDao = new JdbcFolderDao(dbStatement, tableName);

        assertThrows(RuntimeException.class,
                     () -> folderDao.getByParentId(new RecordId("folderId")));

    }

    @Test
    @DisplayName("Should return list of folder records with same parent id and with same name part")
    void testGetByParentIdAndNamePartWithFoundedFolder() throws SQLException {

        var namePart = "namePart";

        var selectSqlQuery = String.format(
                "SELECT * FROM %s WHERE parent_folder_id = '%s' AND name ILIKE '%s'",
                tableName,
                folderRecord.parentFolderId()
                            .value(),
                namePart);

        Mockito.when(dbStatement.executeQuery(selectSqlQuery))
               .thenReturn(resultSet);

        Mockito.when(resultSet.next())
               .thenReturn(true, false);

        addFolderRecordInResultSet(resultSet, folderRecord);

        var folderDao = new JdbcFolderDao(dbStatement, tableName);

        assertThat(folderDao.getByParentIdAndNamePart(folderRecord.parentFolderId(), namePart))
                .isEqualTo(List.of(folderRecord));

    }

    @Test
    @DisplayName("Should throw RuntimeException when catch SQLException")
    void testGetByParentIdAndNamePartWithSQLException() throws SQLException {

        Mockito.when(dbStatement.executeQuery(any()))
               .thenThrow(new SQLException("exception"));

        var folderDao = new JdbcFolderDao(dbStatement, tableName);

        assertThrows(RuntimeException.class,
                     () -> folderDao.getByParentIdAndNamePart(new RecordId("folderId"), "name"));

    }

}

package com.teamdev.filehub.dao.file;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.DbConnection;
import com.teamdev.filehub.dao.JdbcDao;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JdbcFileDao extends JdbcDao<FileRecord> implements FileDao {

    public JdbcFileDao(@Nonnull DbConnection dbStatement,
                       @Nonnull String tableName) {
        super(Preconditions.checkNotNull(tableName),
              Preconditions.checkNotNull(dbStatement),
              new SqlFileConverter(tableName));

    }

    @Override
    public List<FileRecord> getByFolderId(@Nonnull RecordId folderId) {
        Preconditions.checkNotNull(folderId);

        try {
            ResultSet resultSet =
                    dbConnection().executeQuery(
                            String.format("SELECT * FROM %s WHERE folder_id = '%s'",
                                          tableName(),
                                          folderId.value()));

            List<FileRecord> files = new ArrayList<>();

            while (resultSet.next()) {
                files.add(sqlRecordConverter().resultSetToRecord(resultSet));
            }

            return files;

        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }

    @Override
    public List<FileRecord> getByFolderIdAndNamePart(@Nonnull RecordId folderId,
                                                     @Nonnull String namePart) {
        Preconditions.checkNotNull(folderId);
        Preconditions.checkNotNull(namePart);

        try {
            ResultSet resultSet =
                    dbConnection().executeQuery(
                            String.format(
                                    "SELECT * FROM %s WHERE folder_id = '%s' AND name ILIKE '%s'",
                                    tableName(),
                                    folderId.value(),
                                    namePart));

            List<FileRecord> files = new ArrayList<>();

            while (resultSet.next()) {
                files.add(sqlRecordConverter().resultSetToRecord(resultSet));
            }

            return files;

        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }
}

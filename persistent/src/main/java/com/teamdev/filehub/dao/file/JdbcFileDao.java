package com.teamdev.filehub.dao.file;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.JdbcDao;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class JdbcFileDao extends JdbcDao<String, FileRecord> implements FileDao {

    private final String tableName;
    private final Statement dbStatement;
    private final SqlFileConverter sqlConverter;

    public JdbcFileDao(@Nonnull Statement dbStatement,
                       @Nonnull String tableName) {
        super(Preconditions.checkNotNull(tableName),
              Preconditions.checkNotNull(dbStatement),
              new SqlFileConverter(tableName));

        this.tableName = tableName;
        this.dbStatement = dbStatement;
        this.sqlConverter = new SqlFileConverter(tableName);

    }

    @Override
    public List<FileRecord> getFilesInFolder(@Nonnull RecordId<String> folderId) {
        Preconditions.checkNotNull(folderId);

        try {
            ResultSet resultSet =
                    dbStatement.executeQuery(
                            String.format("SELECT * FROM %s WHERE folder_id = '%s'",
                                          tableName,
                                          folderId.value()));

            List<FileRecord> files = new ArrayList<>();

            while (resultSet.next()) {
                files.add(sqlConverter.resultSetToRecord(resultSet));
            }

            return files;

        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }

    @Override
    public List<FileRecord> getByFolderIdAndNamePart(@Nonnull RecordId<String> folderId,
                                                     @Nonnull String namePart) {
        Preconditions.checkNotNull(folderId);
        Preconditions.checkNotNull(namePart);

        try {
            ResultSet resultSet =
                    dbStatement.executeQuery(
                            String.format(
                                    "SELECT * FROM %s WHERE folder_id = '%s' AND name ILIKE '%s'",
                                    tableName,
                                    folderId.value(),
                                    namePart));

            List<FileRecord> files = new ArrayList<>();

            while (resultSet.next()) {
                files.add(sqlConverter.resultSetToRecord(resultSet));
            }

            return files;

        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }
}

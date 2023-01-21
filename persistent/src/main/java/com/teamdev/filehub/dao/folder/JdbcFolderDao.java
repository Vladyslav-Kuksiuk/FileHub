package com.teamdev.filehub.dao.folder;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.JdbcDao;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class JdbcFolderDao extends JdbcDao<FolderRecord> implements FolderDao {

    private final String tableName;
    private final Statement dbStatement;
    private final SqlFolderConverter sqlConverter;

    public JdbcFolderDao(@Nonnull Statement dbStatement,
                         @Nonnull String tableName) {

        super(Preconditions.checkNotNull(tableName),
              Preconditions.checkNotNull(dbStatement),
              new SqlFolderConverter(tableName));

        this.tableName = tableName;
        this.dbStatement = dbStatement;
        this.sqlConverter = new SqlFolderConverter(tableName);

    }

    @Override
    public List<FolderRecord> getInnerFoldersByParentId(@Nonnull RecordId parentId) {
        Preconditions.checkNotNull(parentId);

        try {
            ResultSet resultSet =
                    dbStatement.executeQuery(
                            String.format("SELECT * FROM %s WHERE parent_folder_id = '%s'",
                                          tableName,
                                          parentId.value()));

            List<FolderRecord> innerFolders = new ArrayList<>();

            while (resultSet.next()) {
                innerFolders.add(sqlConverter.resultSetToRecord(resultSet));
            }

            return innerFolders;

        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }

    @Override
    public Optional<FolderRecord> findUserRootFolder(@Nonnull RecordId userId) {
        Preconditions.checkNotNull(userId);

        String selectSqlQuery = String.format(
                "SELECT * FROM %s WHERE owner_id = '%s' AND parent_folder_id IS NULL",
                tableName,
                userId.value());

        try {

            ResultSet resultSet = dbStatement.executeQuery(selectSqlQuery);

            if (resultSet.next()) {
                return Optional.of(sqlConverter.resultSetToRecord(resultSet));
            }

            return Optional.empty();

        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }

    @Override
    public List<FolderRecord> getByParentIdAndNamePart(@Nonnull RecordId parentId,
                                                       @Nonnull String namePart) {
        Preconditions.checkNotNull(parentId);
        Preconditions.checkNotNull(namePart);

        try {
            ResultSet resultSet =
                    dbStatement.executeQuery(
                            String.format(
                                    "SELECT * FROM %s WHERE parent_folder_id = '%s' AND name ILIKE '%s'",
                                    tableName,
                                    parentId.value(),
                                    namePart));

            List<FolderRecord> innerFolders = new ArrayList<>();

            while (resultSet.next()) {
                innerFolders.add(sqlConverter.resultSetToRecord(resultSet));
            }

            return innerFolders;

        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }
}

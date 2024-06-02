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
import java.util.Optional;

/**
 * A {@link FileDao} implementation to work with authentication via JDBC as {@link JdbcDao}.
 */
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
    public Optional<FileRecord> getByShareTag(String shareTag) {
        Preconditions.checkNotNull(shareTag);

        try {
            ResultSet resultSet =
                    dbConnection().executeQuery(
                            String.format("SELECT * FROM %s WHERE share_tag = '%s'",
                                    tableName(),
                                    shareTag));

            List<FileRecord> files = new ArrayList<>();

            while (resultSet.next()) {
                files.add(sqlRecordConverter().resultSetToRecord(resultSet));
            }

            if(files.isEmpty()){
                return Optional.empty();
            }else{
                return Optional.of(files.get(0));
            }

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
                                    "SELECT * FROM %s WHERE folder_id = '%s' AND name ILIKE '%%%s%%'",
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

    @Override
    public FilesStatistics getFilesStatistics() {
        try {
            ResultSet resultSet =
                    dbConnection().executeQuery(
                                    "SELECT mimetype, " +
                                            "Count(*) as files_number, " +
                                            "SUM(size) as size, " +
                                            "SUM(archived_size) as archived_size " +
                                            "FROM public.files " +
                                            "GROUP BY mimetype;");

            var statistics = new FilesStatistics();

            while (resultSet.next()) {
                statistics.addMimetypeItem(new FilesStatisticsMimetypeItem(
                        resultSet.getString("mimetype"),
                        resultSet.getLong("files_number"),
                        resultSet.getLong("size"),
                        resultSet.getLong("archived_size")
                ));
            }

            return statistics;

        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }

    @Override
    public FilesStatistics getFilesStatistics(RecordId user) {
        try {
            ResultSet resultSet =
                    dbConnection().executeQuery( String.format(
                            "SELECT mimetype, " +
                                    "Count(*) as files_number, " +
                                    "SUM(size) as size, " +
                                    "SUM(archived_size) as archived_size " +
                                    "FROM public.files " +
                                    "WHERE owner_id = '%s'" +
                                    "GROUP BY mimetype;",
                            user.value()
                            ));

            var statistics = new FilesStatistics();

            while (resultSet.next()) {
                statistics.addMimetypeItem(new FilesStatisticsMimetypeItem(
                        resultSet.getString("mimetype"),
                        resultSet.getLong("files_number"),
                        resultSet.getLong("size"),
                        resultSet.getLong("archived_size")
                ));
            }

            return statistics;

        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }
}

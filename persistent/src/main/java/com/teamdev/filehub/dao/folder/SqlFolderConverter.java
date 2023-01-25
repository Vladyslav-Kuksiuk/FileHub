package com.teamdev.filehub.dao.folder;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.SqlRecordConverter;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

/**
 * A {@link SqlRecordConverter} implementation for {@link FolderRecord}.
 */
class SqlFolderConverter implements SqlRecordConverter<FolderRecord> {

    private final String table;

    SqlFolderConverter(@Nonnull String table) {
        this.table = Preconditions.checkNotNull(table);
    }

    @Override
    public FolderRecord resultSetToRecord(@Nonnull ResultSet resultSet) {
        Preconditions.checkNotNull(resultSet);

        try {

            return new FolderRecord(new RecordId(resultSet.getString("id")),
                                    new RecordId(resultSet.getString("owner_id")),
                                    new RecordId(resultSet.getString("parent_folder_id")),
                                    resultSet.getString("name"));

        } catch (SQLException e) {
            throw new RuntimeException("Result set reading failed.", e);
        }
    }

    @Override
    public String recordInsertSql(@Nonnull FolderRecord record) {
        Preconditions.checkNotNull(record);

        Optional<String> optionalParentFolderId = Optional.ofNullable(record.parentFolderId()
                                                                            .value());
        String parentFolderId = null;
        if (optionalParentFolderId.isPresent()) {
            parentFolderId = '\'' + optionalParentFolderId.get() + '\'';
        }

        return String.format("INSERT INTO %s (id, owner_id, parent_folder_id, name)" +
                                     "VALUES('%s','%s', %s,'%s')",
                             table,
                             record.id()
                                   .value(),
                             record.ownerId()
                                   .value(),
                             parentFolderId,
                             record.name());
    }

    @Override
    public String recordUpdateSql(@Nonnull FolderRecord record) {
        Preconditions.checkNotNull(record);

        return String.format("UPDATE %s " +
                                     "SET " +
                                     "owner_id = '%s', " +
                                     "parent_folder_id = '%s', " +
                                     "name = '%s'" +
                                     "WHERE id = '%s'",
                             table,
                             record.ownerId()
                                   .value(),
                             record.parentFolderId()
                                   .value(),
                             record.name(),
                             record.id()
                                   .value());
    }
}

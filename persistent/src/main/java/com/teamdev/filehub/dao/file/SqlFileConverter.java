package com.teamdev.filehub.dao.file;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.SqlRecordConverter;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;

public class SqlFileConverter implements SqlRecordConverter<String, FileRecord> {

    private final String table;

    SqlFileConverter(@Nonnull String table) {
        this.table = Preconditions.checkNotNull(table);
    }

    @Override
    public FileRecord resultSetToRecord(@Nonnull ResultSet resultSet) {
        Preconditions.checkNotNull(resultSet);

        try {

            return new FileRecord(new RecordId<>(resultSet.getString(1)),
                                  new RecordId<>(resultSet.getString(2)),
                                  new RecordId<>(resultSet.getString(3)),
                                  resultSet.getString(4),
                                  resultSet.getString(5),
                                  resultSet.getLong(6));

        } catch (SQLException e) {
            throw new RuntimeException("Result set reading failed.", e);
        }
    }

    @Override
    public String recordToInsertSql(@Nonnull FileRecord record) {
        Preconditions.checkNotNull(record);

        return String.format("INSERT INTO %s (id, folder_id, owner_id, name, mimetype, size)" +
                                     "VALUES('%s','%s', '%s','%s','%s','%o')",
                             table,
                             record.id()
                                   .value(),
                             record.folderId()
                                   .value(),
                             record.ownerId()
                                   .value(),
                             record.name(),
                             record.mimetype(),
                             record.size());
    }

    @Override
    public String recordToUpdateSql(@Nonnull FileRecord record) {
        Preconditions.checkNotNull(record);

        return String.format("UPDATE %s" +
                                     "SET" +
                                     "folder_id = '%s'" +
                                     "owner_id = '%s'" +
                                     "name = '%s'" +
                                     "mimetype = '%s'" +
                                     "size = '%o'" +
                                     "WHERE id = '%s'",
                             table,
                             record.folderId()
                                   .value(),
                             record.ownerId()
                                   .value(),
                             record.name(),
                             record.mimetype(),
                             record.size(),
                             record.id()
                                   .value());
    }
}

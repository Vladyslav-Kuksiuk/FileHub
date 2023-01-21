package com.teamdev.filehub.dao.user;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.SqlRecordConverter;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;

public class SqlUserConverter implements SqlRecordConverter<String, UserRecord> {

    private final String table;

    SqlUserConverter(@Nonnull String table) {
        this.table = Preconditions.checkNotNull(table);
    }

    @Override
    public UserRecord resultSetToRecord(@Nonnull ResultSet resultSet) {
        Preconditions.checkNotNull(resultSet);

        try {
            return new UserRecord(new RecordId<>(resultSet.getString(1)),
                                  resultSet.getString(2),
                                  resultSet.getString(3));
        } catch (SQLException e) {
            throw new RuntimeException("Result set reading failed.", e);
        }
    }

    @Override
    public String recordToInsertSql(@Nonnull UserRecord record) {
        Preconditions.checkNotNull(record);

        return String.format("INSERT INTO %s (id, login, password)" +
                                     "VALUES('%s','%s','%s')",
                             table,
                             record.id()
                                   .value(),
                             record.login(),
                             record.password());
    }

    @Override
    public String recordToUpdateSql(@Nonnull UserRecord record) {
        Preconditions.checkNotNull(record);

        return String.format("UPDATE %s" +
                                     "SET" +
                                     "login = '%s'" +
                                     "password = '%s'" +
                                     "WHERE id = '%s'",
                             table,
                             record.login(),
                             record.password(),
                             record.id()
                                   .value());
    }
}

package com.teamdev.filehub.dao.user;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.SqlRecordConverter;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * A {@link SqlRecordConverter} implementation for {@link UserRecord}.
 */
class SqlUserConverter implements SqlRecordConverter<UserRecord> {

    private final String table;

    SqlUserConverter(@Nonnull String table) {
        this.table = Preconditions.checkNotNull(table);
    }

    @Override
    public UserRecord resultSetToRecord(@Nonnull ResultSet resultSet) {
        Preconditions.checkNotNull(resultSet);

        try {
            return new UserRecord(new RecordId(resultSet.getString("id")),
                                  resultSet.getString("login"),
                                  resultSet.getString("password"),
                                  resultSet.getBoolean("is_email_confirmed"),
                                  resultSet.getString("email_hash"));
        } catch (SQLException e) {
            throw new RuntimeException("Result set reading failed.", e);
        }
    }

    @Override
    public String recordInsertSql(@Nonnull UserRecord record) {
        Preconditions.checkNotNull(record);

        return String.format("INSERT INTO %s (id, login, password, is_email_confirmed, email_hash)" +
                                     "VALUES('%s','%s','%s','%s','%s')",
                             table,
                             record.id()
                                   .value(),
                             record.login(),
                             record.password(),
                record.isEmailConfirmed(),
                record.emailHash());
    }

    @Override
    public String recordUpdateSql(@Nonnull UserRecord record) {
        Preconditions.checkNotNull(record);

        return String.format("UPDATE %s " +
                                     "SET " +
                                     "login = '%s', " +
                                     "password = '%s'" +
                                     "is_email_confirmed = '%s'" +
                                     "email_hash = '%s'" +
                                     "WHERE id = '%s'",
                             table,
                             record.login(),
                             record.password(),
                             record.isEmailConfirmed(),
                             record.emailHash(),
                             record.id()
                                   .value());
    }
}

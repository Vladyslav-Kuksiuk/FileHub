package com.teamdev.filehub.dao.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.SqlRecordConverter;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

class SqlAuthenticationConverter implements SqlRecordConverter<AuthenticationRecord> {

    private final String table;

    SqlAuthenticationConverter(@Nonnull String table) {
        this.table = Preconditions.checkNotNull(table);
    }

    @Override
    public AuthenticationRecord resultSetToRecord(@Nonnull ResultSet resultSet) {
        Preconditions.checkNotNull(resultSet);

        try {

            return new AuthenticationRecord(new RecordId(resultSet.getString(1)),
                                            resultSet.getString(2),
                                            resultSet.getTimestamp(3)
                                                     .toLocalDateTime(),
                                            new RecordId(resultSet.getString(4)));

        } catch (SQLException e) {
            throw new RuntimeException("Result set reading failed.", e);
        }
    }

    @Override
    public String recordInsertSql(@Nonnull AuthenticationRecord record) {
        Preconditions.checkNotNull(record);

        return String.format("INSERT INTO %s (id, authentication_token, expire_time, user_id)" +
                                     "VALUES('%s','%s','%s', '%s')",
                             table,
                             record.id()
                                   .value(),
                             record.authenticationToken(),
                             Timestamp.valueOf(record.expireTime()),
                             record.userId()
                                   .value());
    }

    @Override
    public String recordUpdateSql(@Nonnull AuthenticationRecord record) {
        Preconditions.checkNotNull(record);

        return String.format("UPDATE %s" +
                                     "SET" +
                                     "authentication_token = '%s'" +
                                     "expire_time = '%s'" +
                                     "user_id = '%s'" +
                                     "WHERE id = '%s'",
                             table,
                             record.authenticationToken(),
                             Timestamp.valueOf(record.expireTime()),
                             record.userId()
                                   .value(),
                             record.id()
                                   .value());
    }
}

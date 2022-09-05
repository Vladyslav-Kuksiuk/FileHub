package com.teamdev.filehub.dao.user;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.SqlRecordConverter;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SqlUserConverter implements SqlRecordConverter<String, UserRecord> {

    private final String table;

    public SqlUserConverter(String table) {
        this.table = table;
    }

    @Override
    public UserRecord resultSetToRecord(ResultSet resultSet) {

        try {
            return new UserRecord(new RecordId<>(resultSet.getString(1)),
                                  resultSet.getString(2),
                                  resultSet.getString(3),
                                  resultSet.getString(4));
        } catch (SQLException e) {
            throw new RuntimeException("Result set reading failed.", e);
        }
    }

    @Override
    public String recordToInsertSql(UserRecord record) {
        return String.format("INSERT INTO %s (id, login, password, email)" +
                             "VALUES('%s','%s','%s','%s')",
                             table,
                             record.id()
                                   .value(),
                             record.login(),
                             record.password(),
                             record.email());
    }

    @Override
    public String recordToUpdateSql(UserRecord record) {
        return String.format("UPDATE %s" +
                             "SET" +
                             "login = '%s'" +
                             "password = '%s'" +
                             "email = '%s'" +
                             "WHERE id = '%s'",
                             table,
                             record.login(),
                             record.password(),
                             record.email(),
                             record.id()
                                   .value());
    }
}

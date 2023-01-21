package com.teamdev.filehub.dao.user;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.JdbcDao;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

public class JdbcUserDao extends JdbcDao<String, UserRecord> implements UserDao {

    private final String tableName;
    private final Statement dbStatement;
    private final SqlUserConverter sqlConverter;

    public JdbcUserDao(@Nonnull Statement dbStatement,
                       @Nonnull String tableName) {

        super(Preconditions.checkNotNull(tableName),
              Preconditions.checkNotNull(dbStatement),
              new SqlUserConverter(tableName));

        this.tableName = tableName;
        this.dbStatement = dbStatement;
        this.sqlConverter = new SqlUserConverter(tableName);
    }

    @Override
    public Optional<UserRecord> findByLogin(@Nonnull String login) {
        Preconditions.checkNotNull(login);

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE login = '%s'", tableName,
                                              login);

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
}

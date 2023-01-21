package com.teamdev.filehub.dao.user;

import com.teamdev.filehub.dao.JdbcDao;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

public class JdbcUserDao extends JdbcDao<String, UserRecord> implements UserDao {

    private final String tableName;
    private final Statement dbStatement;

    public JdbcUserDao(@Nonnull Statement dbStatement,
                       @Nonnull String tableName) {

        super(tableName,
              dbStatement,
              new SqlUserConverter(tableName));
        this.tableName = tableName;
        this.dbStatement = dbStatement;
    }

    @Override
    public Optional<UserRecord> findByLogin(String login) {

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE login = '%s'", tableName,
                                              login);

        try {
            ResultSet resultSet = dbStatement.executeQuery(selectSqlQuery);

            if (resultSet.next()) {
                return Optional.of(new SqlUserConverter(tableName).resultSetToRecord(resultSet));
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }
}

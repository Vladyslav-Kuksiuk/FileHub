package com.teamdev.filehub.dao.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.JdbcDao;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

public class JdbcAuthenticationDao
        extends JdbcDao<AuthenticationRecord>
        implements AuthenticationDao {

    private final String tableName;
    private final Statement dbStatement;
    private final SqlAuthenticationConverter sqlConverter;

    public JdbcAuthenticationDao(@Nonnull Statement dbStatement,
                                 @Nonnull String tableName) {

        super(Preconditions.checkNotNull(tableName),
              Preconditions.checkNotNull(dbStatement),
              new SqlAuthenticationConverter(tableName));

        this.tableName = tableName;
        this.dbStatement = dbStatement;
        this.sqlConverter = new SqlAuthenticationConverter(tableName);
    }

    @Override
    public Optional<AuthenticationRecord> findByToken(@Nonnull String token) {
        Preconditions.checkNotNull(token);

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE authentication_token = '%s'",
                                              tableName,
                                              token);

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

package com.teamdev.filehub.dao.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.DbConnection;
import com.teamdev.filehub.dao.JdbcDao;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

/**
 * An {@link AuthenticationDao} implementation to work with authentication via JDBC as {@link
 * JdbcDao}.
 */
public class JdbcAuthenticationDao
        extends JdbcDao<AuthenticationRecord>
        implements AuthenticationDao {

    public JdbcAuthenticationDao(@Nonnull DbConnection dbConnection,
                                 @Nonnull String tableName) {

        super(Preconditions.checkNotNull(tableName),
              Preconditions.checkNotNull(dbConnection),
              new SqlAuthenticationConverter(tableName));
    }

    @Override
    public Optional<AuthenticationRecord> findByToken(@Nonnull String token) {
        Preconditions.checkNotNull(token);

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE authentication_token = '%s'",
                                              tableName(),
                                              token);

        try {
            ResultSet resultSet = dbConnection().executeQuery(selectSqlQuery);

            if (resultSet.next()) {
                return Optional.of(sqlRecordConverter().resultSetToRecord(resultSet));
            }
            return Optional.empty();
        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }
}

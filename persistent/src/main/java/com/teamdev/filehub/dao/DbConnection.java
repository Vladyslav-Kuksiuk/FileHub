package com.teamdev.filehub.dao;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Database connection.
 * Provides an API to execute queries in Database.
 */
public class DbConnection {

    private final String dbUrl;
    private final String dbUser;
    private final String dbPassword;

    public DbConnection(@Nonnull String dbUrl,
                        @Nonnull String dbUser,
                        @Nonnull String dbPassword) {
        this.dbUrl = Preconditions.checkNotNull(dbUrl);
        this.dbUser = Preconditions.checkNotNull(dbUser);
        this.dbPassword = Preconditions.checkNotNull(dbPassword);
    }

    /**
     * Executes an SQL statement on a database without returning results.
     *
     * @param sql
     *         The SQL statement to execute.
     */
    public void execute(@Nonnull String sql) {
        Preconditions.checkNotNull(sql);

        try (Connection dbConnection = DriverManager.getConnection(dbUrl, dbUser, dbPassword)) {

            Statement dbStatement = dbConnection.createStatement();
            dbStatement.execute(sql);

        } catch (SQLException e) {

            throw new RuntimeException(e);

        }

    }

    /**
     * Executes an SQL statement on a database with returning results.
     *
     * @param sql
     *         The SQL statement to execute.
     * @return Queried {@link ResultSet}.
     */
    public ResultSet executeQuery(@Nonnull String sql) {
        Preconditions.checkNotNull(sql);

        try (Connection dbConnection = DriverManager.getConnection(dbUrl, dbUser, dbPassword)) {

            Statement dbStatement = dbConnection.createStatement();
            return dbStatement.executeQuery(sql);

        } catch (SQLException e) {

            throw new RuntimeException(e);

        }

    }

}

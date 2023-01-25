package com.teamdev.filehub.dao;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

/**
 * A {@link DataAccessObject} implementation to work with databases via JDBC.
 * Provides CRUD operations.
 *
 * @param <R>
 *         {@link DatabaseRecord} type.
 */
public class JdbcDao<R extends DatabaseRecord> implements DataAccessObject<R> {

    private final String tableName;
    private final SqlRecordConverter<R> sqlRecordConverter;

    private final DbConnection dbConnection;

    protected JdbcDao(@Nonnull String tableName,
                      @Nonnull DbConnection dbConnection,
                      @Nonnull SqlRecordConverter<R> sqlRecordConverter) {

        this.tableName = Preconditions.checkNotNull(tableName);
        this.sqlRecordConverter = Preconditions.checkNotNull(sqlRecordConverter);
        this.dbConnection = Preconditions.checkNotNull(dbConnection);

    }

    @Override
    public Optional<R> find(@Nonnull RecordId id) {
        Preconditions.checkNotNull(id);

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE id = '%s'", tableName,
                                              id.value());

        try {
            ResultSet resultSet = dbConnection.executeQuery(selectSqlQuery);

            if (resultSet.next()) {
                return Optional.of(sqlRecordConverter.resultSetToRecord(resultSet));
            }

        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }

        return Optional.empty();
    }

    @Override
    public void delete(@Nonnull RecordId id) {
        Preconditions.checkNotNull(id);

        String deleteSqlQuery = String.format("DELETE FROM %s WHERE id = '%s'", tableName,
                                              id.value());

        dbConnection.execute(deleteSqlQuery);

    }

    @Override
    public void create(@Nonnull R record) {
        Preconditions.checkNotNull(record);

        String insertSqlQuery = sqlRecordConverter.recordInsertSql(record);

        dbConnection.execute((insertSqlQuery));

    }

    @Override
    public void update(@Nonnull R record) {
        Preconditions.checkNotNull(record);

        String updateSqlQuery = sqlRecordConverter.recordUpdateSql(record);

        dbConnection.execute(updateSqlQuery);

    }

    protected DbConnection dbConnection() {
        return dbConnection;
    }

    protected String tableName() {
        return tableName;
    }

    protected SqlRecordConverter<R> sqlRecordConverter() {
        return sqlRecordConverter;
    }
}

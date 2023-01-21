package com.teamdev.filehub.dao;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

public class JdbcDao<R extends DatabaseRecord> implements DataAccessObject<R> {

    private final String tableName;
    private final SqlRecordConverter<R> converter;

    private final Statement dbStatement;

    protected JdbcDao(@Nonnull String tableName,
                      @Nonnull Statement dbStatement,
                      @Nonnull SqlRecordConverter<R> converter) {

        this.tableName = Preconditions.checkNotNull(tableName);
        this.converter = Preconditions.checkNotNull(converter);
        this.dbStatement = Preconditions.checkNotNull(dbStatement);

    }

    @Override
    public Optional<R> find(@Nonnull RecordId id) {
        Preconditions.checkNotNull(id);

        String selectSqlQuery = String.format("SELECT * FROM %s WHERE id = '%s'", tableName,
                                              id.value());

        try {
            ResultSet resultSet = dbStatement.executeQuery(selectSqlQuery);

            if (resultSet.next()) {
                return Optional.of(converter.resultSetToRecord(resultSet));
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

        executeSql(deleteSqlQuery);

    }

    @Override
    public void create(@Nonnull R record) {
        Preconditions.checkNotNull(record);

        String insertSqlQuery = converter.recordInsertSql(record);

        executeSql(insertSqlQuery);

    }

    @Override
    public void update(@Nonnull R record) {
        Preconditions.checkNotNull(record);

        String updateSqlQuery = converter.recordUpdateSql(record);

        executeSql(updateSqlQuery);

    }

    protected void executeSql(String sql) {
        try {
            dbStatement.execute(sql);
        } catch (SQLException e) {
            throw new RuntimeException("Database query failed.", e);
        }
    }
}

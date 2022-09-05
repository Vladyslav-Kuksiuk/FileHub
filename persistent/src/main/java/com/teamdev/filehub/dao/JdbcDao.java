package com.teamdev.filehub.dao;

import javax.annotation.Nonnull;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

public abstract class JdbcDao<I, R extends DatabaseRecord<I>> implements DataAccessObject<I, R> {

    private final String tableName;
    private final SqlRecordConverter<I, R> converter;

    private final Statement dbStatement;

    protected JdbcDao(@Nonnull String tableName,
                      @Nonnull Statement dbStatement,
                      @Nonnull SqlRecordConverter<I, R> converter) {
        this.tableName = tableName;
        this.converter = converter;
        this.dbStatement = dbStatement;

    }

    @Override
    public Optional<R> find(@Nonnull RecordId<I> id) {

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
    public void delete(@Nonnull RecordId<I> id) {

        String deleteSqlQuery = String.format("DELETE FROM %s WHERE id = '%s'", tableName,
                                              id.value());

        executeSql(deleteSqlQuery);

    }

    @Override
    public void create(@Nonnull R record) {

        String insertSqlQuery = converter.recordToInsertSql(record);

        executeSql(insertSqlQuery);

    }

    @Override
    public void update(@Nonnull R record) {

        String updateSqlQuery = converter.recordToUpdateSql(record);

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

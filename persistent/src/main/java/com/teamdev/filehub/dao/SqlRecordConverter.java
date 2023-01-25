package com.teamdev.filehub.dao;

import javax.annotation.Nonnull;
import java.sql.ResultSet;

/**
 * Converter to provide work with {@link DatabaseRecord} in SQL.
 *
 * @param <R>
 *         {@link DatabaseRecord} type.
 */
public interface SqlRecordConverter<R extends DatabaseRecord> {

    /**
     * Converts {@link ResultSet} into {@link R}.
     *
     * @param resultSet
     *         The query result set.
     * @return {@link R}
     */
    R resultSetToRecord(@Nonnull ResultSet resultSet);

    /**
     * Converts {@link R} into insert query on SQL.
     *
     * @param record
     *         {@link R} to insert.
     * @return insert query on SQL.
     */
    String recordInsertSql(@Nonnull R record);

    /**
     * Converts {@link R} into update query on SQL.
     *
     * @param record
     *         {@link R} to update.
     * @return update query on SQL.
     */
    String recordUpdateSql(@Nonnull R record);

}

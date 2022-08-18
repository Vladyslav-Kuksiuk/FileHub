package com.teamdev.persistent.dao;

import javax.validation.constraints.NotNull;

/**
 * An interface that provides methods for CRUD operations.
 *
 * @param <R>
 *         {@link DatabaseRecord} implementation.
 * @param <I>
 *         {@link RecordIdentifier} type.
 */
public interface DataAccessObject<R extends DatabaseRecord<I>, I> {

    /**
     * Method to find a record in the database.
     *
     * @param id
     *         Record identifier.
     * @return Found record.
     */
    R find(@NotNull RecordIdentifier<I> id) throws DataAccessException;

    /**
     * Method to delete a record in the database.
     *
     * @param id
     *         Record identifier.
     */
    void delete(@NotNull RecordIdentifier<I> id) throws DataAccessException;

    /**
     * Method to create a record in the database.
     *
     * @param record
     *         Record to create.
     */
    void create(@NotNull R record) throws DataAccessException;

    /**
     * Method to create a record in the database.
     *
     * @param record
     *         Record to update.
     */
    void update(@NotNull R record) throws DataAccessException;

}

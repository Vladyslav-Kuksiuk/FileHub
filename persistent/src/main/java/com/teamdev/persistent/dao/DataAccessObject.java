package com.teamdev.persistent.dao;

/**
 * An interface that provides methods for CRUD operations.
 *
 * @param <R>
 *         {@link DatabaseRecord} implementation.
 * @param <I>
 *         {@link RecordId} type.
 */
public interface DataAccessObject<I, R extends DatabaseRecord<I>> {

    /**
     * Method to find a record in the database.
     *
     * @param id
     *         Record identifier.
     * @return Found record.
     */
    R find(RecordId<I> id) throws DataAccessException;

    /**
     * Method to delete a record in the database.
     *
     * @param id
     *         Record identifier.
     */
    void delete(RecordId<I> id) throws DataAccessException;

    /**
     * Method to create a record in the database.
     *
     * @param record
     *         Record to create.
     */
    void create(R record) throws DataAccessException;

    /**
     * Method to create a record in the database.
     *
     * @param record
     *         Record to update.
     */
    void update(R record) throws DataAccessException;

}

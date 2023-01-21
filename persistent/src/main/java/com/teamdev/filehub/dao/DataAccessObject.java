package com.teamdev.filehub.dao;

import java.util.Optional;

/**
 * An interface that provides methods for CRUD operations.
 *
 * @param <R>
 *         {@link DatabaseRecord} implementation.
 */
public interface DataAccessObject<R extends DatabaseRecord> {

    /**
     * Method to find a record in the database.
     *
     * @param id
     *         Record identifier.
     * @return Found record.
     */
    Optional<R> find(RecordId id);

    /**
     * Method to delete a record in the database.
     *
     * @param id
     *         Record identifier.
     */
    void delete(RecordId id);

    /**
     * Method to create a record in the database.
     *
     * @param record
     *         Record to create.
     */
    void create(R record);

    /**
     * Method to create a record in the database.
     *
     * @param record
     *         Record to update.
     */
    void update(R record);

}

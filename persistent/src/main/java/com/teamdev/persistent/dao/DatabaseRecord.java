package com.teamdev.persistent.dao;

import javax.annotation.Nonnull;

/**
 * Class to store information about record in database.
 *
 * @param <I>
 *         identifier type.
 */
public abstract class DatabaseRecord<I> {

    private final RecordIdentifier<I> id;

    protected DatabaseRecord(@Nonnull RecordIdentifier<I> id) {
        this.id = id;
    }

    public RecordIdentifier<I> getId() {
        return id;
    }
}

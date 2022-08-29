package com.teamdev.persistent.dao;

import javax.annotation.Nonnull;

/**
 * Class to store information about record in database.
 *
 * @param <I>
 *         identifier type.
 */
public abstract class DatabaseRecord<I> {

    private final RecordId<I> id;

    protected DatabaseRecord(@Nonnull RecordId<I> id) {
        this.id = id;
    }

    public RecordId<I> getId() {
        return id;
    }
}

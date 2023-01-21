package com.teamdev.filehub.dao;

import javax.annotation.Nonnull;

/**
 * Class to store information about record in database.
 */
public abstract class DatabaseRecord {

    private final RecordId id;

    protected DatabaseRecord(@Nonnull RecordId id) {
        this.id = id;
    }

    public RecordId id() {
        return id;
    }
}

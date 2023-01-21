package com.teamdev.filehub.dao;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;

/**
 * Class to store information about record in database.
 */
public class DatabaseRecord {

    private final RecordId id;

    protected DatabaseRecord(@Nonnull RecordId id) {
        this.id = Preconditions.checkNotNull(id);
    }

    public RecordId id() {
        return id;
    }
}

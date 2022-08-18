package com.teamdev.persistent.dao;

import javax.validation.constraints.NotNull;

/**
 * Class to store information about record in database.
 *
 * @param <I>
 *         identifier type.
 */
public abstract class DatabaseRecord<I> {

    private final RecordIdentifier<I> identifier;

    protected DatabaseRecord(@NotNull RecordIdentifier<I> identifier) {
        this.identifier = identifier;
    }

    public RecordIdentifier<I> getIdentifier() {
        return identifier;
    }
}

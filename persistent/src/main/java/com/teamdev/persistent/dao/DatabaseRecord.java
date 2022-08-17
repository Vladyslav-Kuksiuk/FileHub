package com.teamdev.persistent.dao;

import javax.validation.constraints.NotNull;

public abstract class DatabaseRecord<I> {

    private final RecordIdentifier<I> identifier;

    protected DatabaseRecord(@NotNull RecordIdentifier<I> identifier) {
        this.identifier = identifier;
    }

    public RecordIdentifier<I> getIdentifier() {
        return identifier;
    }
}

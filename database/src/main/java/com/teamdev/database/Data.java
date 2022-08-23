package com.teamdev.database;

import com.google.common.base.Preconditions;

import javax.validation.constraints.NotNull;

public abstract class Data<I> {

    private final I id;

    public Data(@NotNull I id) {
        this.id = Preconditions.checkNotNull(id);
    }

    public I id() {
        return id;
    }
}

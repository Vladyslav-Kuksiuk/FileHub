package com.teamdev.database;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;

/**
 * Class which extender are intended to store some data with identifier.
 *
 * @param <I>
 *         Identifier type.
 */
public abstract class Data<I> {

    private final I id;

    public Data(@Nonnull I id) {
        this.id = Preconditions.checkNotNull(id);
    }

    public I id() {
        return id;
    }
}

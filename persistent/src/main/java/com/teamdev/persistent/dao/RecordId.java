package com.teamdev.persistent.dao;

import javax.annotation.Nonnull;
import java.util.Objects;

/**
 * Value object to store identifier for {@link DatabaseRecord}.
 *
 * @param <T>
 *         identifier type.
 */
public class RecordId<T> {

    private final T id;

    public RecordId(@Nonnull T id) {
        this.id = id;
    }

    public T value() {
        return id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public boolean equals(@Nonnull Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RecordId)) {
            return false;
        }
        RecordId<T> that = (RecordId<T>) o;
        return id.equals(that.id);
    }
}

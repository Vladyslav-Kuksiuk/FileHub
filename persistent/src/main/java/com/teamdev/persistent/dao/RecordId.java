package com.teamdev.persistent.dao;

import java.util.Objects;

/**
 * Value object to store identifier for {@link DatabaseRecord}.
 *
 * @param <T>
 *         identifier type.
 */
public class RecordId<T> {

    private final T id;

    public RecordId(T id) {
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
    public boolean equals(Object o) {
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

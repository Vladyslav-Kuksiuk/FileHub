package com.teamdev.filehub.dao;

import com.google.common.base.Objects;

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
        return Objects.hashCode(id);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        RecordId<?> id1 = (RecordId<?>) o;
        return Objects.equal(id, id1.id);
    }
}

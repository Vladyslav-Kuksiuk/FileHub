package com.teamdev.persistent.dao;

import javax.validation.constraints.NotNull;
import java.util.Objects;

/**
 * Value object to store identifier for {@link DatabaseRecord}.
 *
 * @param <T>
 *         identifier type.
 */
public class RecordIdentifier<T> {

    private final T id;

    public RecordIdentifier(@NotNull T id) {
        this.id = id;
    }

    public T getValue() {
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
        if (!(o instanceof RecordIdentifier)) {
            return false;
        }
        RecordIdentifier<T> that = (RecordIdentifier<T>) o;
        return id.equals(that.id);
    }
}

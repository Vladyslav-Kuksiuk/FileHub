package com.teamdev.filehub.dao;

import com.google.common.base.Objects;

import javax.annotation.Nullable;

/**
 * Value object to store identifier for {@link DatabaseRecord}.
 */
public class RecordId {

    private final String id;

    public RecordId(@Nullable String id) {
        this.id = id;
    }

    public String value() {
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
        if (!(o instanceof RecordId)) {
            return false;
        }
        RecordId id1 = (RecordId) o;
        return Objects.equal(id, id1.id);
    }
}

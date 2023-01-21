package com.teamdev.filehub;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;

/**
 * Class which extender are intended to store some data with identifier.
 */
public class Data {

    private final String id;

    public Data(@Nonnull String id) {
        this.id = Preconditions.checkNotNull(id);
    }

    public String id() {
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
        if (!(o instanceof Data)) {
            return false;
        }
        Data data = (Data) o;
        return Objects.equal(id, data.id);
    }
}

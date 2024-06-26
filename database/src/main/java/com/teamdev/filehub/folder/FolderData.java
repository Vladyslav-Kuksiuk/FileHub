package com.teamdev.filehub.folder;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.Data;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * A {@link Data} implementation to store information about folder.
 */
public class FolderData extends Data {

    private final String ownerId;

    private final String parentFolderId;

    private final String name;

    public FolderData(@Nonnull String id,
                      @Nullable String ownerId,
                      @Nonnull String parentFolderId,
                      @Nonnull String name) {

        super(Preconditions.checkNotNull(id));
        this.ownerId = Preconditions.checkNotNull(ownerId);
        this.parentFolderId = parentFolderId;
        this.name = Preconditions.checkNotNull(name);
    }

    public String ownerId() {
        return ownerId;
    }

    public String parentFolderId() {
        return parentFolderId;
    }

    public String name() {
        return name;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(ownerId, parentFolderId, name);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FolderData)) {
            return false;
        }
        FolderData data = (FolderData) o;
        return Objects.equal(id(), data.id()) &&
                Objects.equal(ownerId, data.ownerId) &&
                Objects.equal(parentFolderId, data.parentFolderId) &&
                Objects.equal(name, data.name);
    }
}

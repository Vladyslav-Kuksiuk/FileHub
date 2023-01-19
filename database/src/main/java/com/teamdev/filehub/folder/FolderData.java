package com.teamdev.filehub.folder;

import com.google.common.base.Objects;
import com.teamdev.filehub.Data;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Class which is intended to store information about folder.
 */
public class FolderData extends Data<String> {

    private final String ownerId;

    private final String parentFolderId;

    private final String name;

    public FolderData(@Nonnull String id,
                      @Nullable String ownerId,
                      @Nonnull String parentFolderId,
                      @Nonnull String name) {
        super(id);
        this.ownerId = ownerId;
        this.parentFolderId = parentFolderId;
        this.name = name;
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
        return Objects.equal(ownerId, data.ownerId) &&
                Objects.equal(parentFolderId, data.parentFolderId) &&
                Objects.equal(name, data.name);
    }
}

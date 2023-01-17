package com.teamdev.filehub.views.folderinfo;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Server response which is intended to store
 * information about the folder.
 */
public class FolderInfo {

    private final String name;
    private final String id;
    private final String parentId;

    public FolderInfo(@Nonnull String name,
                      @Nonnull String id,
                      @Nullable String parentId) {
        this.name = Preconditions.checkNotNull(name);
        this.id = Preconditions.checkNotNull(id);
        this.parentId = parentId;
    }

    public String name() {
        return name;
    }

    public String id() {
        return id;
    }

    public String parentId() {
        return parentId;
    }
}

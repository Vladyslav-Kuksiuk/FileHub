package com.teamdev.database.folder;

import com.teamdev.database.Data;

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
}

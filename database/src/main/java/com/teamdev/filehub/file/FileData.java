package com.teamdev.filehub.file;

import com.teamdev.filehub.Data;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Class which is intended to store information about file meta context.
 */
public class FileData extends Data<String> {

    private final String folderId;
    private final String ownerId;
    private final String name;
    private final String extension;

    public FileData(@Nonnull String id,
                    @Nonnull String folderId,
                    @Nullable String ownerId,
                    @Nonnull String name,
                    @Nonnull String extension) {
        super(id);

        this.folderId = folderId;
        this.ownerId = ownerId;
        this.name = name;
        this.extension = extension;
    }

    public String folderId() {
        return folderId;
    }

    public String ownerId() {
        return ownerId;
    }

    public String name() {
        return name;
    }

    public String extension() {
        return extension;
    }
}

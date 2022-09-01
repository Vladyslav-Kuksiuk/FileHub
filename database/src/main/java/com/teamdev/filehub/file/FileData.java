package com.teamdev.filehub.file;

import com.google.common.base.Objects;
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

    @Override
    public int hashCode() {
        return Objects.hashCode(folderId, ownerId, name, extension);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FileData fileData = (FileData) o;
        return Objects.equal(folderId, fileData.folderId) &&
               Objects.equal(ownerId, fileData.ownerId) &&
               Objects.equal(name, fileData.name) &&
               Objects.equal(extension, fileData.extension);
    }
}

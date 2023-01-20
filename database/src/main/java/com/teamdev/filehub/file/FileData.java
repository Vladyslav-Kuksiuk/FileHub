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
    private final String mimetype;
    private final long size;

    public FileData(@Nonnull String id,
                    @Nonnull String folderId,
                    @Nullable String ownerId,
                    @Nonnull String name,
                    @Nonnull String mimetype,
                    long size) {
        super(id);

        this.folderId = folderId;
        this.ownerId = ownerId;
        this.name = name;
        this.mimetype = mimetype;
        this.size = size;
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

    public String mimetype() {
        return mimetype;
    }

    public long size() {
        return size;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(folderId, ownerId, name, mimetype, size);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FileData)) {
            return false;
        }
        FileData data = (FileData) o;
        return size == data.size && Objects.equal(folderId, data.folderId) &&
                Objects.equal(ownerId, data.ownerId) &&
                Objects.equal(name, data.name) &&
                Objects.equal(mimetype, data.mimetype);
    }
}

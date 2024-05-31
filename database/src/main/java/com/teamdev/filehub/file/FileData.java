package com.teamdev.filehub.file;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.Data;

import javax.annotation.Nonnull;

/**
 * A {@link Data} implementation to store information about file.
 */
public class FileData extends Data {

    private final String folderId;
    private final String ownerId;
    private final String name;
    private final String mimetype;
    private final long size;
    private final long archivedSize;
    private final String extension;
    private final String shareTag;

    public FileData(@Nonnull String id,
                    @Nonnull String folderId,
                    @Nonnull String ownerId,
                    @Nonnull String name,
                    @Nonnull String mimetype,
                    long size,
                    long archivedSize,
                    @Nonnull String extension,
                    @Nonnull String shareTag
                    ) {
        super(Preconditions.checkNotNull(id));

        this.folderId = Preconditions.checkNotNull(folderId);
        this.ownerId = Preconditions.checkNotNull(ownerId);
        this.name = Preconditions.checkNotNull(name);
        this.mimetype = Preconditions.checkNotNull(mimetype);
        this.size = size;
        this.archivedSize = archivedSize;
        this.extension = Preconditions.checkNotNull(extension);
        this.shareTag = Preconditions.checkNotNull(shareTag);
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

    public long archivedSize() {
        return archivedSize;
    }

    public String extension() {
        return extension;
    }

    public String shareTag() {
        return shareTag;
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
        return size == data.size && Objects.equal(id(), data.id()) &&
                size == data.size && Objects.equal(folderId, data.folderId) &&
                Objects.equal(ownerId, data.ownerId) &&
                Objects.equal(name, data.name) &&
                Objects.equal(shareTag, data.shareTag) &&
                Objects.equal(archivedSize, data.archivedSize) &&
                Objects.equal(extension, data.extension) &&
                Objects.equal(mimetype, data.mimetype);
    }
}

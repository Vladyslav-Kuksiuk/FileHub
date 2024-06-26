package com.teamdev.filehub.dao.file;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.DatabaseRecord;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

import static com.google.common.base.Preconditions.checkNotNull;

/**
 * {@link DatabaseRecord} implementation which is intended to store data about file meta context.
 */
public class FileRecord extends DatabaseRecord {

    private final RecordId folderId;
    private final RecordId ownerId;
    private final String name;
    private final String mimetype;
    private final long size;
    private final long archivedSize;
    private final String extension;
    private final String shareTag;

    public FileRecord(
            @Nonnull RecordId id,
            @Nonnull RecordId folderId,
            @Nonnull RecordId ownerId,
            @Nonnull String name,
            @Nonnull String mimetype,
            long size,
            long archivedSize,
            @Nonnull String extension,
            String shareTag
            ) {
        super(checkNotNull(id));

        this.folderId = checkNotNull(folderId);
        this.ownerId = checkNotNull(ownerId);
        this.name = checkNotNull(name);
        this.mimetype = checkNotNull(mimetype);
        this.size = size;
        this.archivedSize = archivedSize;
        this.extension = checkNotNull(extension);
        this.shareTag = shareTag;
    }

    public RecordId folderId() {
        return folderId;
    }

    public RecordId ownerId() {
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
        if (!(o instanceof FileRecord)) {
            return false;
        }
        FileRecord that = (FileRecord) o;
        return size == that.size &&
                Objects.equal(folderId, that.folderId) &&
                Objects.equal(id(), that.id()) &&
                Objects.equal(ownerId, that.ownerId) &&
                Objects.equal(name, that.name) &&
                Objects.equal(mimetype, that.mimetype) &&
                Objects.equal(extension, that.extension) &&
                Objects.equal(shareTag, that.shareTag);
    }
}

package com.teamdev.filehub.dao.file;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.DatabaseRecord;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * {@link DatabaseRecord} implementation which is intended to store data about file meta context.
 */
public class FileRecord extends DatabaseRecord<String> {

    private final RecordId<String> folderId;
    private final RecordId<String> ownerId;
    private final String name;
    private final String mimetype;
    private final long size;

    public FileRecord(
            @Nonnull RecordId<String> id,
            @Nonnull RecordId<String> folderId,
            @Nonnull RecordId<String> ownerId,
            @Nonnull String name,
            @Nonnull String mimetype,
            long size) {
        super(Preconditions.checkNotNull(id));

        this.folderId = Preconditions.checkNotNull(folderId);
        this.ownerId = Preconditions.checkNotNull(ownerId);
        this.name = Preconditions.checkNotNull(name);
        this.mimetype = Preconditions.checkNotNull(mimetype);
        this.size = size;
    }

    public RecordId<String> folderId() {
        return folderId;
    }

    public RecordId<String> ownerId() {
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
                Objects.equal(mimetype, that.mimetype);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(folderId, ownerId, name, mimetype, size);
    }
}

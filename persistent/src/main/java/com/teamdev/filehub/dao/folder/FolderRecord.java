package com.teamdev.filehub.dao.folder;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.DatabaseRecord;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * {@link DatabaseRecord} implementation which is intended to store data about the folder.
 */
public class FolderRecord extends DatabaseRecord {

    private final RecordId ownerId;

    private final RecordId parentFolderId;

    private final String name;

    public FolderRecord(@Nonnull RecordId id,
                        @Nonnull RecordId ownerId,
                        @Nonnull RecordId parentFolderId,
                        @Nonnull String name) {

        super(Preconditions.checkNotNull(id));
        this.ownerId = Preconditions.checkNotNull(ownerId);
        this.parentFolderId = Preconditions.checkNotNull(parentFolderId);
        this.name = Preconditions.checkNotNull(name);
    }

    public RecordId ownerId() {
        return ownerId;
    }

    public RecordId parentFolderId() {
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
        if (!(o instanceof FolderRecord)) {
            return false;
        }
        FolderRecord that = (FolderRecord) o;
        return Objects.equal(id(), that.id()) &&
                Objects.equal(ownerId, that.ownerId) &&
                Objects.equal(parentFolderId, that.parentFolderId) &&
                Objects.equal(name, that.name);
    }
}

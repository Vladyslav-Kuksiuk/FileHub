package com.teamdev.filehub.dao.folder;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.DatabaseRecord;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * {@link DatabaseRecord} implementation which is intended to store data about the folder.
 */
public class FolderRecord extends DatabaseRecord<String> {

    private final RecordId<String> ownerId;

    private final RecordId<String> parentFolderId;

    private final String name;

    public FolderRecord(@Nonnull RecordId<String> id,
                        @Nonnull RecordId<String> ownerId,
                        @Nonnull RecordId<String> parentFolderId,
                        @Nonnull String name) {
        super(Preconditions.checkNotNull(id));
        this.ownerId = Preconditions.checkNotNull(ownerId);
        this.parentFolderId = Preconditions.checkNotNull(parentFolderId);
        this.name = Preconditions.checkNotNull(name);
    }

    public RecordId<String> ownerId() {
        return ownerId;
    }

    public RecordId<String> parentFolderId() {
        return parentFolderId;
    }

    public String name() {
        return name;
    }
}

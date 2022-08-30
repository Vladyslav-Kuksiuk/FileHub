package com.teamdev.persistent.dao.folder;

import com.teamdev.persistent.dao.DatabaseRecord;
import com.teamdev.persistent.dao.RecordId;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * {@link DatabaseRecord} implementation which is intended to store data about the folder.
 */
public class FolderRecord extends DatabaseRecord<String> {

    private final RecordId<String> ownerId;

    private final RecordId<String> parentFolderId;

    private final String name;

    protected FolderRecord(@Nonnull RecordId<String> id,
                           @Nonnull RecordId<String> ownerId,
                           @Nullable RecordId<String> parentFolderId,
                           @Nonnull String name) {
        super(id);
        this.ownerId = ownerId;
        this.parentFolderId = parentFolderId;
        this.name = name;
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

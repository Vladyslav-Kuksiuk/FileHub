package com.teamdev.filehub.dao.file;

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
    private final String extension;

    public FileRecord(
            @Nonnull RecordId<String> id,
            @Nonnull RecordId<String> folderId,
            @Nonnull RecordId<String> ownerId,
            @Nonnull String name,
            @Nonnull String extension) {
        super(Preconditions.checkNotNull(id));

        this.folderId = Preconditions.checkNotNull(folderId);
        this.ownerId = Preconditions.checkNotNull(ownerId);
        this.name = Preconditions.checkNotNull(name);
        this.extension = Preconditions.checkNotNull(extension);
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

    public String extension() {
        return extension;
    }
}

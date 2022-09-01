package com.teamdev.filehub.dao.file;

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
        super(id);

        this.folderId = folderId;
        this.ownerId = ownerId;
        this.name = name;
        this.extension = extension;
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

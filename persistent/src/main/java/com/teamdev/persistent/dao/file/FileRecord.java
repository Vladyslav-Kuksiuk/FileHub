package com.teamdev.persistent.dao.file;

import com.teamdev.persistent.dao.DatabaseRecord;
import com.teamdev.persistent.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * {@link DatabaseRecord} implementation which is intended to store data about file meta context.
 */
public class FileRecord extends DatabaseRecord<String> {

    private final String filePath;
    private final RecordId<String> ownerId;

    public FileRecord(
            @Nonnull RecordId<String> id,
            @Nonnull RecordId<String> ownerId,
            @Nonnull String filePath) {
        super(id);
        this.ownerId = ownerId;
        this.filePath = filePath;
    }

    public String filePath() {
        return filePath;
    }

    public RecordId<String> ownerId() {
        return ownerId;
    }
}

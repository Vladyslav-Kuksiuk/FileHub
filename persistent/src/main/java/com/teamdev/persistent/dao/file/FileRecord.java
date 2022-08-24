package com.teamdev.persistent.dao.file;

import com.teamdev.persistent.dao.DatabaseRecord;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.annotation.Nonnull;

public class FileRecord extends DatabaseRecord<String> {

    private final String filePath;
    private final RecordIdentifier<String> ownerId;

    public FileRecord(
            @Nonnull RecordIdentifier<String> id,
            @Nonnull RecordIdentifier<String> ownerId,
            @Nonnull String filePath) {
        super(id);
        this.ownerId = ownerId;
        this.filePath = filePath;
    }

    public String filePath() {
        return filePath;
    }

    public RecordIdentifier<String> ownerId() {
        return ownerId;
    }
}

package com.teamdev.database.file;

import com.teamdev.database.Data;

import javax.annotation.Nonnull;

public class FileData extends Data<String> {

    private final String ownerId;
    private final String filePath;

    public FileData(@Nonnull String id,
                    @Nonnull String ownerId,
                    @Nonnull String filePath) {
        super(id);
        this.ownerId = ownerId;
        this.filePath = filePath;
    }

    public String ownerId() {
        return ownerId;
    }

    public String filePath() {
        return filePath;
    }
}

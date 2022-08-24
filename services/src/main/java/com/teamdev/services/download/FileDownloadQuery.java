package com.teamdev.services.download;

import com.google.common.base.Preconditions;
import com.teamdev.services.Query;

import javax.annotation.Nonnull;

public class FileDownloadQuery implements Query {

    private final String userId;
    private final String filePath;

    public FileDownloadQuery(@Nonnull String userId,
                             @Nonnull String filePath) {
        this.userId = Preconditions.checkNotNull(userId);
        this.filePath = Preconditions.checkNotNull(filePath);
    }

    public String userId() {
        return userId;
    }

    public String filePath() {
        return filePath;
    }
}

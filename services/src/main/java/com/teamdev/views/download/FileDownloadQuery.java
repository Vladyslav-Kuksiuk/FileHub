package com.teamdev.views.download;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.views.Query;

import javax.annotation.Nonnull;

/**
 * A {@link Query} implementation which is intended to store
 * data about file downloading.
 */
public class FileDownloadQuery implements Query {

    private final RecordId<String> userId;
    private final String filePath;

    public FileDownloadQuery(@Nonnull RecordId<String> userId,
                             @Nonnull String filePath) {
        this.userId = Preconditions.checkNotNull(userId);
        this.filePath = Preconditions.checkNotNull(filePath);
    }

    public RecordId<String> userId() {
        return userId;
    }

    public String filePath() {
        return filePath;
    }
}

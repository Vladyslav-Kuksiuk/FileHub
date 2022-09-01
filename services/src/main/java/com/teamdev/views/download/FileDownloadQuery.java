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
    private final RecordId<String> fileId;

    public FileDownloadQuery(@Nonnull RecordId<String> userId,
                             @Nonnull RecordId<String> fileId) {
        this.userId = Preconditions.checkNotNull(userId);
        this.fileId = Preconditions.checkNotNull(fileId);
    }

    public RecordId<String> userId() {
        return userId;
    }

    public RecordId<String> fileId() {
        return fileId;
    }
}

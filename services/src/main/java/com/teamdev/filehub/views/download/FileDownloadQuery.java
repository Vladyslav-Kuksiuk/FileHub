package com.teamdev.filehub.views.download;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.Query;

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

    @Override
    public int hashCode() {
        return Objects.hashCode(userId, fileId);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FileDownloadQuery)) {
            return false;
        }
        FileDownloadQuery query = (FileDownloadQuery) o;
        return Objects.equal(userId, query.userId) &&
                Objects.equal(fileId, query.fileId);
    }
}

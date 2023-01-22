package com.teamdev.filehub.views.download;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AuthenticatedUserQuery;
import com.teamdev.filehub.views.Query;

import javax.annotation.Nonnull;

/**
 * An {@link AuthenticatedUserQuery} implementation to represent user's 'download file' request.
 */
public class FileDownloadQuery implements Query {

    private final RecordId userId;
    private final RecordId fileId;

    public FileDownloadQuery(@Nonnull RecordId userId,
                             @Nonnull RecordId fileId) {

        this.userId = Preconditions.checkNotNull(userId);
        this.fileId = Preconditions.checkNotNull(fileId);
    }

    public RecordId userId() {
        return userId;
    }

    public RecordId fileId() {
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

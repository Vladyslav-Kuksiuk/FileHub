package com.teamdev.filehub.views.file;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AuthenticatedUserQuery;
import com.teamdev.filehub.views.Query;

import javax.annotation.Nonnull;

/**
 * An {@link AuthenticatedUserQuery} implementation to represent user's 'download file' request.
 */
public class SharedFileDownloadQuery implements Query {

    private final String shareTag;

    public SharedFileDownloadQuery(@Nonnull String shareTag) {
        this.shareTag = Preconditions.checkNotNull(shareTag);
    }

    public String shareTag() {
        return shareTag;
    }
}

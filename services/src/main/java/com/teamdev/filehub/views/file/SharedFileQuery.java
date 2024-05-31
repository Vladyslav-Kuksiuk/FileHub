package com.teamdev.filehub.views.file;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.views.AuthenticatedUserQuery;
import com.teamdev.filehub.views.Query;

import javax.annotation.Nonnull;

/**
 * An {@link AuthenticatedUserQuery} implementation to represent 'view shared file' request.
 */
public class SharedFileQuery implements Query {

    private final String shareTag;

    public SharedFileQuery(@Nonnull String shareTag) {
        this.shareTag = Preconditions.checkNotNull(shareTag);
    }

    public String shareTag() {
        return shareTag;
    }
}

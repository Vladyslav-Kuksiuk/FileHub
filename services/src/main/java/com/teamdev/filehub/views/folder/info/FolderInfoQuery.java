package com.teamdev.filehub.views.folder.info;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AuthenticatedUserQuery;
import com.teamdev.filehub.views.Query;

import javax.annotation.Nonnull;

/**
 * An {@link AuthenticatedUserQuery} implementation to represent 'load folder info' request.
 */
public class FolderInfoQuery extends AuthenticatedUserQuery {

    private final RecordId folderId;

    public FolderInfoQuery(@Nonnull RecordId userId,
                           @Nonnull RecordId folderId) {
        super(Preconditions.checkNotNull(userId));
        this.folderId = Preconditions.checkNotNull(folderId);
    }

    public RecordId folderId() {
        return folderId;
    }
}

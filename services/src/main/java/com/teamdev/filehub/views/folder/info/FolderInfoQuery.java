package com.teamdev.filehub.views.folder.info;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AuthenticatedUserQuery;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserQuery} implementation which is intended to store
 * data about folder info query.
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

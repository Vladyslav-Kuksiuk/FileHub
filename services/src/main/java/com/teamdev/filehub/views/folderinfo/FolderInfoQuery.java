package com.teamdev.filehub.views.folderinfo;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AuthenticatedUserQuery;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserQuery} implementation which is intended to store
 * data about folder info query.
 */
public class FolderInfoQuery extends AuthenticatedUserQuery {

    private final RecordId<String> folderId;

    public FolderInfoQuery(@Nonnull RecordId<String> userId,
                           @Nonnull RecordId<String> folderId) {
        super(Preconditions.checkNotNull(userId));
        this.folderId = Preconditions.checkNotNull(folderId);
    }

    public RecordId<String> folderId() {
        return folderId;
    }
}

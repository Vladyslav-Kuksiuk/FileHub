package com.teamdev.filehub.views.folder.content;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AuthenticatedUserQuery;
import com.teamdev.filehub.views.Query;

import javax.annotation.Nonnull;

/**
 * A {@link Query} implementation which is intended to store
 * data about folder content query.
 */
public class FolderContentQuery extends AuthenticatedUserQuery {

    private final RecordId folderId;

    public FolderContentQuery(@Nonnull RecordId userId,
                              @Nonnull RecordId folderId) {
        super(userId);
        this.folderId = Preconditions.checkNotNull(folderId);
    }

    public RecordId folderId() {
        return folderId;
    }
}

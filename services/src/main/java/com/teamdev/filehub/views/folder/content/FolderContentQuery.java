package com.teamdev.filehub.views.folder.content;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.Query;

/**
 * A {@link Query} implementation which is intended to store
 * data about folder content query.
 */
public class FolderContentQuery implements Query {

    private final RecordId<String> userId;
    private final RecordId<String> folderId;

    public FolderContentQuery(RecordId<String> userId,
                              RecordId<String> folderId) {
        this.userId = Preconditions.checkNotNull(userId);
        this.folderId = Preconditions.checkNotNull(folderId);
    }

    public RecordId<String> userId() {
        return userId;
    }

    public RecordId<String> folderId() {
        return folderId;
    }
}

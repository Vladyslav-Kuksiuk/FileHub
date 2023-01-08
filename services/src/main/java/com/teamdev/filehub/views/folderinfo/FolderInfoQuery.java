package com.teamdev.filehub.views.folderinfo;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.Query;

/**
 * A {@link Query} implementation which is intended to store
 * data about folder info query.
 */
public class FolderInfoQuery implements Query {

    private final RecordId<String> userId;
    private final RecordId<String> folderId;

    public FolderInfoQuery(RecordId<String> userId,
                           RecordId<String> folderId) {
        this.userId = userId;
        this.folderId = folderId;
    }

    public RecordId<String> userId() {
        return userId;
    }

    public RecordId<String> folderId() {
        return folderId;
    }
}

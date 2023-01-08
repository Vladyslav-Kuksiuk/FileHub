package com.teamdev.filehub.views.folder.content;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.Query;

public class FolderContentQuery implements Query {

    private final RecordId<String> userId;
    private final RecordId<String> folderId;

    public FolderContentQuery(RecordId<String> userId,
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

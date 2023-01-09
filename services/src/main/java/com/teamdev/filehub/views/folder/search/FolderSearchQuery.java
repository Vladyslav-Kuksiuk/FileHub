package com.teamdev.filehub.views.folder.search;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.Query;

/**
 * A {@link Query} implementation which is intended to store
 * data about search in folder query.
 */
public class FolderSearchQuery implements Query {

    private final RecordId<String> userId;
    private final RecordId<String> folderId;
    private final String searchWord;

    public FolderSearchQuery(RecordId<String> userId,
                             RecordId<String> folderId,
                             String searchWord) {
        this.userId = Preconditions.checkNotNull(userId);
        this.folderId = Preconditions.checkNotNull(folderId);
        this.searchWord = Preconditions.checkNotNull(searchWord);
    }

    public RecordId<String> userId() {
        return userId;
    }

    public RecordId<String> folderId() {
        return folderId;
    }

    public String searchWord() {
        return searchWord;
    }
}

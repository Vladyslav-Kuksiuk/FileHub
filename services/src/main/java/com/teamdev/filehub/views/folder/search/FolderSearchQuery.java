package com.teamdev.filehub.views.folder.search;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AuthenticatedUserQuery;
import com.teamdev.filehub.views.Query;

import javax.annotation.Nonnull;

/**
 * A {@link Query} implementation which is intended to store
 * data about search in folder query.
 */
public class FolderSearchQuery extends AuthenticatedUserQuery {

    private final RecordId<String> folderId;
    private final String searchWord;

    public FolderSearchQuery(@Nonnull RecordId<String> userId,
                             @Nonnull RecordId<String> folderId,
                             @Nonnull String searchWord) {
        super(userId);
        this.folderId = Preconditions.checkNotNull(folderId);
        this.searchWord = Preconditions.checkNotNull(searchWord);
    }

    public RecordId<String> folderId() {
        return folderId;
    }

    public String searchWord() {
        return searchWord;
    }
}

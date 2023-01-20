package com.teamdev.filehub.views.folder.search;

import com.google.common.base.Objects;
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
        super(Preconditions.checkNotNull(userId));
        this.folderId = Preconditions.checkNotNull(folderId);
        this.searchWord = Preconditions.checkNotNull(searchWord);
    }

    public RecordId<String> folderId() {
        return folderId;
    }

    public String searchWord() {
        return searchWord;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FolderSearchQuery)) {
            return false;
        }
        FolderSearchQuery query = (FolderSearchQuery) o;
        return Objects.equal(userId(), query.userId()) &&
                Objects.equal(folderId, query.folderId) &&
                Objects.equal(searchWord, query.searchWord);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(userId(), folderId, searchWord);
    }
}

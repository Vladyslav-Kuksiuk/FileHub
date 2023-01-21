package com.teamdev.filehub.views;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * An abstract {@link Query} with an authenticated user id.
 */
public class AuthenticatedUserQuery implements Query {

    private final RecordId userId;

    protected AuthenticatedUserQuery(@Nonnull RecordId userId) {
        this.userId = Preconditions.checkNotNull(userId);
    }

    public RecordId userId() {
        return userId;
    }
}

package com.teamdev.filehub.views;

import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * An abstract {@link Query} with an authenticated admin.
 */
public class AuthenticatedAdminQuery implements Query {

    private final RecordId userId;

    protected AuthenticatedAdminQuery(@Nonnull RecordId userId) {
        this.userId = userId;
    }

    public RecordId userId() {
        return userId;
    }
}

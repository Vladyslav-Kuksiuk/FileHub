package com.teamdev.filehub.processes;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * An abstract {@link Command} with an authenticated user id.
 */
public abstract class AuthenticatedUserCommand implements Command {

    private final RecordId<String> userId;

    protected AuthenticatedUserCommand(@Nonnull RecordId<String> userId) {
        this.userId = Preconditions.checkNotNull(userId);
    }

    public RecordId<String> userId() {
        return userId;
    }
}

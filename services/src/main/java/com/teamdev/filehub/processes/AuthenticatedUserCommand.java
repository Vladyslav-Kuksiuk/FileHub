package com.teamdev.filehub.processes;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * {@link Command} extension with data about authenticated user.
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

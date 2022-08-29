package com.teamdev.processes;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * {@link Command} extension with data for authorization.
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

package com.teamdev.processes;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.annotation.Nonnull;

/**
 * {@link Command} extension with data for authorization.
 */
public abstract class AuthenticatedUserCommand implements Command {

    private final RecordIdentifier<String> userId;

    protected AuthenticatedUserCommand(@Nonnull RecordIdentifier<String> userId) {
        this.userId = Preconditions.checkNotNull(userId);
    }

    public RecordIdentifier<String> userId() {
        return userId;
    }
}

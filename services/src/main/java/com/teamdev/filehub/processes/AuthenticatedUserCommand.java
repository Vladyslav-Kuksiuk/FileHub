package com.teamdev.filehub.processes;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * {@link Command} implementation with an authenticated user id.
 */
public class AuthenticatedUserCommand implements Command {

    private final RecordId userId;

    public AuthenticatedUserCommand(@Nonnull RecordId userId) {
        this.userId = Preconditions.checkNotNull(userId);
    }

    public RecordId userId() {
        return userId;
    }
}

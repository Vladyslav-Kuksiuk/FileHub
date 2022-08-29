package com.teamdev.processes;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.processes.Command;

import javax.annotation.Nonnull;

/**
 * {@link Command} extension with data for authorization.
 */
public abstract class CommandWithAuthorizationData implements Command {

    private final RecordIdentifier<String> userId;

    private final String authenticationToken;

    protected CommandWithAuthorizationData(@Nonnull RecordIdentifier<String> userId,
                                           @Nonnull String authenticationToken) {
        this.userId = Preconditions.checkNotNull(userId);
        this.authenticationToken = Preconditions.checkNotNull(authenticationToken);
    }

    public RecordIdentifier<String> userId() {
        return userId;
    }

    public String authenticationToken() {
        return authenticationToken;
    }
}

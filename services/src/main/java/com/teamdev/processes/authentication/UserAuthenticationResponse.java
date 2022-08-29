package com.teamdev.processes.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.ServerResponse;

import javax.annotation.Nonnull;

/**
 * {@link ServerResponse} implementation which is intended to store
 * information about the user authentication server's response.
 */
public class UserAuthenticationResponse implements ServerResponse {

    private final RecordIdentifier<String> userId;

    private final String authenticationToken;

    public UserAuthenticationResponse(@Nonnull RecordIdentifier<String> userId,
                                      @Nonnull String authenticationToken) {
        Preconditions.checkNotNull(authenticationToken);
        Preconditions.checkState(!authenticationToken.isEmpty());

        this.userId = Preconditions.checkNotNull(userId);
        this.authenticationToken = authenticationToken;
    }

    public RecordIdentifier<String> userId() {
        return userId;
    }

    public String authenticationToken() {
        return authenticationToken;
    }
}

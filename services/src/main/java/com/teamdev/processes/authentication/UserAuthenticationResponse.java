package com.teamdev.processes.authentication;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;

/**
 * Server response which is intended to store
 * information about the user authentication server's response.
 */
public class UserAuthenticationResponse {

    private final String authenticationToken;

    public UserAuthenticationResponse(@Nonnull String authenticationToken) {
        Preconditions.checkNotNull(authenticationToken);
        Preconditions.checkState(!authenticationToken.isEmpty());

        this.authenticationToken = authenticationToken;
    }

    public String authenticationToken() {
        return authenticationToken;
    }
}

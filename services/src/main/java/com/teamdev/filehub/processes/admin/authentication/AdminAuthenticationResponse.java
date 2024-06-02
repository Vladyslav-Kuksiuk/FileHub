package com.teamdev.filehub.processes.admin.authentication;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;

/**
 * Server response which is intended to store
 * information about the admin authentication.
 */
public class AdminAuthenticationResponse {

    private final String authenticationToken;

    public AdminAuthenticationResponse(@Nonnull String authenticationToken) {
        Preconditions.checkNotNull(authenticationToken);
        Preconditions.checkState(!authenticationToken.isEmpty());

        this.authenticationToken = authenticationToken;
    }

    public String authenticationToken() {
        return authenticationToken;
    }
}

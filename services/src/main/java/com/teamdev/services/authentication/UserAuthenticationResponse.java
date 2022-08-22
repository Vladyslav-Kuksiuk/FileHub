package com.teamdev.services.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.services.ServerResponse;

import javax.validation.constraints.NotNull;

/**
 * {@link ServerResponse} implementation which is intended to store
 * information about the user authentication server's response.
 */
public class UserAuthenticationResponse implements ServerResponse {

    private final RecordIdentifier<String> userId;

    private final String authenticationToken;

    public UserAuthenticationResponse(@NotNull RecordIdentifier<String> userId,
                                      @NotNull String authenticationToken) {
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

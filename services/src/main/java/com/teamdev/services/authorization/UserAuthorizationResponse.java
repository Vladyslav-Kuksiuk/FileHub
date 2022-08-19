package com.teamdev.services.authorization;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.services.ServerResponse;

import javax.validation.constraints.NotNull;

/**
 * {@link ServerResponse} implementation which is intended to store
 * information about the user authorization server's response.
 */
public class UserAuthorizationResponse implements ServerResponse {

    private final RecordIdentifier<String> userId;

    private final String authenticationToken;

    public UserAuthorizationResponse(@NotNull RecordIdentifier<String> userId,
                                     @NotNull String authenticationToken) {
        Preconditions.checkState(!authenticationToken.isEmpty());

        this.userId = userId;
        this.authenticationToken = authenticationToken;
    }

    public RecordIdentifier<String> userId() {
        return userId;
    }

    public String authenticationToken() {
        return authenticationToken;
    }
}

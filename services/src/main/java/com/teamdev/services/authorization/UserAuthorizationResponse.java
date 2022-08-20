package com.teamdev.services.authorization;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.services.ServerResponse;

/**
 * {@link ServerResponse} implementation which is intended to store
 * information about the user authorization server's response.
 */
public class UserAuthorizationResponse implements ServerResponse {

    private final RecordIdentifier<String> userId;

    private final String authenticationToken;

    public UserAuthorizationResponse(RecordIdentifier<String> userId,
                                     String authenticationToken) {
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

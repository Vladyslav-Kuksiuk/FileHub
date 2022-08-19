package com.teamdev.database.user;

import javax.validation.constraints.NotNull;

public class AuthorizationData {

    private final String userId;

    private final String authenticationToken;

    private final long authorizationTime;

    public AuthorizationData(@NotNull String userId,
                             @NotNull String authenticationToken,
                             long authorizationTime) {
        this.userId = userId;
        this.authenticationToken = authenticationToken;
        this.authorizationTime = authorizationTime;
    }

    public String getUserId() {
        return userId;
    }

    public String getAuthenticationToken() {
        return authenticationToken;
    }

    public long getAuthorizationTime() {
        return authorizationTime;
    }
}

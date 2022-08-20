package com.teamdev.database.user;

import com.google.common.base.Preconditions;

import javax.validation.constraints.NotNull;

public class AuthorizationData {

    private final String userId;

    private final String authenticationToken;

    private final long authorizationTime;

    public AuthorizationData(@NotNull String userId,
                             @NotNull String authenticationToken,
                             long authorizationTime) {
        Preconditions.checkState(!userId.isEmpty());
        Preconditions.checkState(!authenticationToken.isEmpty());
        Preconditions.checkState(authorizationTime >= 0);

        this.userId = userId;
        this.authenticationToken = authenticationToken;
        this.authorizationTime = authorizationTime;
    }

    public String userId() {
        return userId;
    }

    public String authenticationToken() {
        return authenticationToken;
    }

    public long authorizationTime() {
        return authorizationTime;
    }
}

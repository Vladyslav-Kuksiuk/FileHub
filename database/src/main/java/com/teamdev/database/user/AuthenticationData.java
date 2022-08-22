package com.teamdev.database.user;

import com.google.common.base.Preconditions;

import javax.validation.constraints.NotNull;

/**
 * Class which is intended to store information about authentication.
 */
public class AuthenticationData {

    private final String userId;

    private final String authenticationToken;

    private final String expireTime;

    public AuthenticationData(@NotNull String userId,
                              @NotNull String authenticationToken,
                              @NotNull String expireTime) {
        Preconditions.checkState(!userId.isEmpty());
        Preconditions.checkState(!authenticationToken.isEmpty());
        Preconditions.checkState(!expireTime.isEmpty());

        this.userId = userId;
        this.authenticationToken = authenticationToken;
        this.expireTime = expireTime;
    }

    public String userId() {
        return userId;
    }

    public String authenticationToken() {
        return authenticationToken;
    }

    public String expireTime() {
        return expireTime;
    }
}

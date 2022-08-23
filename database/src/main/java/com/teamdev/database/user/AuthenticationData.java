package com.teamdev.database.user;

import com.google.common.base.Preconditions;
import com.teamdev.database.Data;

import javax.validation.constraints.NotNull;

/**
 * Class which is intended to store information about authentication.
 */
public class AuthenticationData extends Data<String> {

    private final String authenticationToken;

    private final String expireTime;

    public AuthenticationData(@NotNull String id,
                              @NotNull String authenticationToken,
                              @NotNull String expireTime) {
        super(Preconditions.checkNotNull(id));
        Preconditions.checkState(!authenticationToken.isEmpty());
        Preconditions.checkState(!expireTime.isEmpty());

        this.authenticationToken = authenticationToken;
        this.expireTime = expireTime;
    }

    public String authenticationToken() {
        return authenticationToken;
    }

    public String expireTime() {
        return expireTime;
    }
}

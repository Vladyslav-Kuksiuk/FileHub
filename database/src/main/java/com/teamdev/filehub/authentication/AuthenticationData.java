package com.teamdev.filehub.authentication;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.Data;

import javax.validation.constraints.NotNull;

/**
 * A {@link Data} implementation to store information about authentication.
 */
public class AuthenticationData extends Data {

    private final String authenticationToken;

    private final String expireTime;
    private final String userId;

    public AuthenticationData(@NotNull String id,
                              @NotNull String authenticationToken,
                              @NotNull String expireTime,
                              @NotNull String userId) {

        super(Preconditions.checkNotNull(id));
        this.authenticationToken = Preconditions.checkNotNull(authenticationToken);
        this.expireTime = Preconditions.checkNotNull(expireTime);
        this.userId = Preconditions.checkNotNull(userId);
    }

    public String authenticationToken() {
        return authenticationToken;
    }

    public String expireTime() {
        return expireTime;
    }

    public String userId() {
        return userId;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(authenticationToken, expireTime);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AuthenticationData)) {
            return false;
        }
        AuthenticationData data = (AuthenticationData) o;
        return Objects.equal(authenticationToken, data.authenticationToken) &&
                Objects.equal(expireTime, data.expireTime);
    }
}

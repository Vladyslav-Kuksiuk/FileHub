package com.teamdev.filehub.views.authorization;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.views.Query;

import javax.annotation.Nonnull;

/**
 * A {@link Query} implementation which is intended to store
 * data about user authorization.
 */
public class UserAuthorizationQuery implements Query {

    private final String authorizationToken;

    public UserAuthorizationQuery(@Nonnull String authorizationToken) {
        this.authorizationToken = Preconditions.checkNotNull(authorizationToken);
    }

    public String authorizationToken() {
        return authorizationToken;
    }
}

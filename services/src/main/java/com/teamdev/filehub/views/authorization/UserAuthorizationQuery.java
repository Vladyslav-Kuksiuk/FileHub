package com.teamdev.filehub.views.authorization;

import com.teamdev.filehub.views.Query;

/**
 * A {@link Query} implementation which is intended to store
 * data about user authorization.
 */
public class UserAuthorizationQuery implements Query {
    private final String authorizationToken;

    public UserAuthorizationQuery(String authorizationToken) {
        this.authorizationToken = authorizationToken;
    }

    public String authorizationToken() {
        return authorizationToken;
    }
}

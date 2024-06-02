package com.teamdev.filehub.views.authorization.admin;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.views.AuthenticatedUserQuery;
import com.teamdev.filehub.views.Query;

import javax.annotation.Nonnull;

/**
 * An {@link AuthenticatedUserQuery} implementation to represent 'authorize' request.
 */
public class AdminAuthorizationQuery implements Query {

    private final String authorizationToken;

    public AdminAuthorizationQuery(@Nonnull String authorizationToken) {
        this.authorizationToken = Preconditions.checkNotNull(authorizationToken);
    }

    public String authorizationToken() {
        return authorizationToken;
    }
}

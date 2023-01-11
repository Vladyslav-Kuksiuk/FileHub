package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.google.common.base.Splitter;
import com.google.common.collect.Iterables;
import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationQuery;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;

public abstract class AuthorizedUserRoute extends WrappedRoute {

    private final UserAuthorizationView authorizationView;

    public AuthorizedUserRoute(UserAuthorizationView authorizationView) {
        this.authorizationView = Preconditions.checkNotNull(authorizationView);
    }

    @Override
    protected final void wrappedHandle(WrappedRequest request, WrappedResponse response)
            throws ServiceException, JsonEntityValidationException {
        Preconditions.checkNotNull(request, response);
        String authorizationHeader = request.headers("Authorization");
        String token = Iterables.get(Splitter.on(' ')
                                             .split(authorizationHeader), 1);

        RecordId<String> userId = authorizationView.handle(new UserAuthorizationQuery(token));

        authorizedHandle(request, response, userId);
    }

    protected abstract void authorizedHandle(WrappedRequest request,
                                             WrappedResponse response,
                                             RecordId<String> userId)
            throws ServiceException, JsonEntityValidationException;
}

package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.google.common.base.Splitter;
import com.google.common.collect.Iterables;
import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.admin.AdminAuthorizationQuery;
import com.teamdev.filehub.views.authorization.admin.AdminAuthorizationView;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An abstract implementation of {@link WrappedRoute} with authorization feature.
 * Authorization provides the admin id by token, if there is one in the system.
 */
public abstract class AuthorizedAdminRoute extends WrappedRoute {

    private final AdminAuthorizationView authorizationView;

    public AuthorizedAdminRoute(@Nonnull AdminAuthorizationView authorizationView) {
        this.authorizationView = Preconditions.checkNotNull(authorizationView);
    }

    /**
     * Authorizes the user and calls {@link #authorizedHandle}.
     */
    @Override
    protected final void wrappedRequestHandle(WrappedRequest request, Response response)
            throws ServiceException, JsonEntityValidationException {
        Preconditions.checkNotNull(request, response);
        String authorizationHeader = request.headers("Authorization");
        String token = Iterables.get(Splitter.on(' ')
                                             .split(authorizationHeader), 1);

        RecordId userId = authorizationView.handle(new AdminAuthorizationQuery(token));

        authorizedHandle(request, response, userId);
    }

    /**
     * Handles {@link WrappedRequest} to modify and provide {@link Response}.
     * You must override this method to write own AuthorizedAdminRoute.
     *
     * @param request
     *         The request object providing information about the HTTP request.
     * @param response
     *         The response object providing functionality for modifying the response.
     * @param adminId
     *         Authorized admin id.
     * @throws ServiceException
     *         When service handles request with exception.
     * @throws JsonEntityValidationException
     *         When JSON body can`t be processed.
     */
    protected abstract void authorizedHandle(WrappedRequest request,
                                             Response response,
                                             RecordId adminId)
            throws ServiceException, JsonEntityValidationException;
}

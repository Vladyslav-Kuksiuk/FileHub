package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UnauthorizedUserException;
import com.teamdev.filehub.views.authorization.UserAuthorizationQuery;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * {@link Route} with the ability to authorize the user.
 */
abstract class AuthorizedRoute implements Route {

    private final UserAuthorizationView authorizationView;

    public AuthorizedRoute(UserAuthorizationView authorizationView) {
        this.authorizationView = Preconditions.checkNotNull(authorizationView);
    }

    /**
     * Handles {@link Request} and authorize user.
     *
     * @param request
     *         HTTP request.
     * @param response
     *         HTTP response.
     * @return Server response.
     */
    @Override
    public final Object handle(Request request, Response response) {
        Preconditions.checkNotNull(request, response);

        String authorizationHeader = request.headers("Authorization");
        String token = authorizationHeader.split(" ")[1];

        try {
            RecordId<String> userId = authorizationView.handle(new UserAuthorizationQuery(token));
            return authorizedHandle(request, response, userId);
        } catch (UnauthorizedUserException e) {
            response.status(401);
            return e.getMessage();
        }
    }

    /**
     * Handles {@link Request} by authorized user.
     * You may override this method to write own AuthorizedRoute.
     *
     * @param request
     *         HTTP request.
     * @param response
     *         HTTP response.
     * @param userId
     *         Authorized user id.
     * @return Server response.
     */
    protected abstract Object authorizedHandle(Request request, Response response,
                                               RecordId<String> userId);
}

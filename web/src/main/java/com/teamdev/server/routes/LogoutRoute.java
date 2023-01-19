package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.logout.UserLogoutCommand;
import com.teamdev.filehub.processes.logout.UserLogoutProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'log out user' request handling.
 */
public class LogoutRoute extends AuthorizedUserRoute {

    private final UserLogoutProcess userLogoutProcess;

    public LogoutRoute(@Nonnull UserAuthorizationView authorizationView,
                       @Nonnull UserLogoutProcess userLogoutProcess) {
        super(Preconditions.checkNotNull(authorizationView));
        this.userLogoutProcess = Preconditions.checkNotNull(userLogoutProcess);
    }

    /**
     * Handles 'log out user' request.
     *
     * @param request
     *         The request object providing information about the HTTP request.
     * @param response
     *         The response object providing functionality for modifying the response.
     * @param userId
     *         Authorized user id.
     */
    @Override
    protected void authorizedHandle(WrappedRequest request, Response response,
                                    RecordId<String> userId) {

        UserLogoutCommand command = new UserLogoutCommand(userId);
        response.body(userLogoutProcess.handle(command)
                                       .value());

    }
}

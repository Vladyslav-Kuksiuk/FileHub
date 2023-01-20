package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.filesystem.remove.RemoveCommand;
import com.teamdev.filehub.processes.filesystem.remove.RemoveProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'remove item' request handling.
 */
public class RemoveItemRoute extends AuthorizedUserRoute {

    private final RemoveProcess removeProcess;

    public RemoveItemRoute(
            @Nonnull UserAuthorizationView authorizationView,
            @Nonnull RemoveProcess removeProcess) {

        super(Preconditions.checkNotNull(authorizationView));
        this.removeProcess = Preconditions.checkNotNull(removeProcess);
    }

    /**
     * Handles 'remove item' request.
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
                                    RecordId<String> userId)
            throws ServiceException, JsonEntityValidationException {

        var itemId = new RecordId<>(request.params(":id"));

        var command = new RemoveCommand(userId, itemId);

        response.body(removeProcess.handle(command)
                                   .value());
    }
}

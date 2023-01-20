package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.filesystem.rename.RenameCommand;
import com.teamdev.filehub.processes.filesystem.rename.RenameProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'rename item' request handling.
 */
public class RenameItemRoute extends AuthorizedUserRoute {

    private final RenameProcess renameItemProcess;

    public RenameItemRoute(
            @Nonnull UserAuthorizationView authorizationView,
            @Nonnull RenameProcess renameFileProcess) {

        super(Preconditions.checkNotNull(authorizationView));
        this.renameItemProcess = Preconditions.checkNotNull(renameFileProcess);
    }

    /**
     * Handles 'rename item' request.
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
                                    RecordId<String> userId) throws ServiceException,
                                                                    JsonEntityValidationException {
        var jsonBody = request.jsonBody();

        var command = new RenameCommand(userId,
                                        new RecordId<>(request.params(":id")),
                                        jsonBody.getAsString("name"));

        var itemId = renameItemProcess.handle(command);

        response.body(itemId.value());

    }
}

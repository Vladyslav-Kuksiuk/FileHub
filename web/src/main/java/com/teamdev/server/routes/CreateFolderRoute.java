package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.RequestFieldValidationException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.filesystem.create.FolderCreateCommand;
import com.teamdev.filehub.processes.filesystem.create.FolderCreateProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'create folder' request handling.
 */
public class CreateFolderRoute extends AuthorizedUserRoute {

    private final FolderCreateProcess folderCreateProcess;

    public CreateFolderRoute(
            @Nonnull UserAuthorizationView authorizationView,
            @Nonnull FolderCreateProcess folderCreateProcess) {
        super(Preconditions.checkNotNull(authorizationView));
        this.folderCreateProcess = Preconditions.checkNotNull(folderCreateProcess);
    }

    /**
     * Handles 'create folder' request.
     *
     * @param request
     *         The request object providing information about the HTTP request.
     * @param response
     *         The response object providing functionality for modifying the response.
     * @throws JsonEntityValidationException
     *         If JSON body can`t be processed.
     * @throws AccessDeniedException
     *         If the user doesn't have access.
     * @throws RequestFieldValidationException
     *         If request as command validation failed.
     */
    @Override
    protected void authorizedHandle(WrappedRequest request, Response response,
                                    RecordId userId)
            throws AccessDeniedException,
                   JsonEntityValidationException,
                   RequestFieldValidationException, DataNotFoundException {

        var jsonBody = request.jsonBody();

        var command = new FolderCreateCommand(
                userId,
                new RecordId(jsonBody.getAsString("parentId")),
                jsonBody.getAsString("name"));

        response.body(folderCreateProcess.handle(command)
                                         .value());

    }
}

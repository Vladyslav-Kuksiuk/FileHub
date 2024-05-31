package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.admin.ban.ChangeBanStatusCommand;
import com.teamdev.filehub.processes.admin.ban.ChangeBanStatusProcess;
import com.teamdev.filehub.processes.admin.filesystem.DeleteUserFilesCommand;
import com.teamdev.filehub.processes.admin.filesystem.DeleteUserFilesProcess;
import com.teamdev.filehub.views.authorization.admin.AdminAuthorizationView;
import com.teamdev.server.AuthorizedAdminRoute;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedAdminRoute} implementation to provide 'load files statistics' request handling.
 */
public class DeleteUsersFilesRoute extends AuthorizedAdminRoute {

    private final DeleteUserFilesProcess deleteUserFilesProcess;
    private final Gson gson = new Gson();

    public DeleteUsersFilesRoute(
            @Nonnull AdminAuthorizationView authorizationView,
            @Nonnull DeleteUserFilesProcess deleteUserFilesProcess) {

        super(Preconditions.checkNotNull(authorizationView));
        this.deleteUserFilesProcess = Preconditions.checkNotNull(deleteUserFilesProcess);
    }

    /**
     * Handles 'delete user files' request.
     *
     * @param request  The request object providing information about the HTTP request.
     * @param response The response object providing functionality for modifying the response.
     * @param userId   Authorized user id.
     */
    @Override
    protected void authorizedHandle(WrappedRequest request, Response response,
                                    RecordId userId)
            throws DataNotFoundException, AccessDeniedException, JsonEntityValidationException {
        var jsonBody = request.jsonBody();

        DeleteUserFilesCommand command = new DeleteUserFilesCommand(userId, jsonBody.getAsString("email"));

        deleteUserFilesProcess.handle(command);
    }
}

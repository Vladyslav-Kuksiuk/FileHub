package com.teamdev.server.routes;

import com.google.gson.Gson;
import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.filesystem.share.ChangeFileShareStatusCommand;
import com.teamdev.filehub.processes.filesystem.share.ChangeFileShareStatusProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

import static com.google.common.base.Preconditions.checkNotNull;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'share/stop sharing' request handling.
 */
public class ChangeFileShareStatusRoute extends AuthorizedUserRoute {

    private final Gson gson = new Gson();

    private final ChangeFileShareStatusProcess changeFileShareStatusProcess;
    private final boolean shareStatus;

    public ChangeFileShareStatusRoute(
            @Nonnull UserAuthorizationView authorizationView,
            @Nonnull ChangeFileShareStatusProcess changeFileShareStatusProcess,
            boolean shareStatus) {

        super(checkNotNull(authorizationView));
        this.changeFileShareStatusProcess = checkNotNull(changeFileShareStatusProcess);
        this.shareStatus = shareStatus;
    }

    /**
     * Handles 'rename item' request.
     *
     * @param request  The request object providing information about the HTTP request.
     * @param response The response object providing functionality for modifying the response.
     * @param userId   Authorized user id.
     */
    @Override
    protected void authorizedHandle(WrappedRequest request, Response response,
                                    RecordId userId) throws ServiceException,
            JsonEntityValidationException {
        var jsonBody = request.jsonBody();

        var command = new ChangeFileShareStatusCommand(userId,
                new RecordId(jsonBody.getAsString("file")),
                shareStatus
                );

        response.body(gson.toJson(changeFileShareStatusProcess.handle(command)));
    }
}

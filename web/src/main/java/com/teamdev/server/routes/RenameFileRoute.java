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

public class RenameFileRoute extends AuthorizedUserRoute {

    private final RenameProcess renameFileProcess;

    public RenameFileRoute(
            @Nonnull UserAuthorizationView authorizationView,
            @Nonnull RenameProcess renameFileProcess) {

        super(Preconditions.checkNotNull(authorizationView));
        this.renameFileProcess = Preconditions.checkNotNull(renameFileProcess);
    }

    @Override
    protected void authorizedHandle(WrappedRequest request, Response response,
                                    RecordId<String> userId) throws ServiceException,
                                                                    JsonEntityValidationException {
        var jsonBody = request.jsonBody();

        var command = new RenameCommand(userId,
                                        new RecordId<>(request.params(":id")),
                                        jsonBody.getAsString("name"));

        var fileId = renameFileProcess.handle(command);

        response.body(fileId.value());

    }
}

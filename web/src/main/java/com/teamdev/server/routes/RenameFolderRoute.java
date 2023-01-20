package com.teamdev.server.routes;

import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.folder.rename.FolderRenameCommand;
import com.teamdev.filehub.processes.folder.rename.FolderRenameProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import spark.Response;

public class RenameFolderRoute extends AuthorizedUserRoute {

    private final FolderRenameProcess folderRenameProcess;

    public RenameFolderRoute(
            UserAuthorizationView authorizationView,
            FolderRenameProcess folderRenameProcess) {
        super(authorizationView);
        this.folderRenameProcess = folderRenameProcess;
    }

    @Override
    protected void authorizedHandle(WrappedRequest request, Response response,
                                    RecordId<String> userId) throws ServiceException,
                                                                    JsonEntityValidationException {

        var jsonBody = request.jsonBody();

        var command = new FolderRenameCommand(userId,
                                              new RecordId<>(request.params(":id")),
                                              jsonBody.getAsString("name"));

        var folderId = folderRenameProcess.handle(command);

    }
}

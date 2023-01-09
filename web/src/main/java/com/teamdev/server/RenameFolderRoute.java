package com.teamdev.server;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.DataNotFoundException;
import com.teamdev.filehub.processes.folder.rename.FolderRenameCommand;
import com.teamdev.filehub.processes.folder.rename.FolderRenameProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import spark.Request;
import spark.Response;

public class RenameFolderRoute extends AuthorizedRoute {

    private final Gson gson = new Gson();
    private final FolderRenameProcess folderRenameProcess;

    public RenameFolderRoute(
            UserAuthorizationView authorizationView,
            FolderRenameProcess folderRenameProcess) {
        super(authorizationView);
        this.folderRenameProcess = folderRenameProcess;
    }

    /**
     * Parses the {@link FolderRenameCommand} from the request body
     * and handle it with the {@link FolderRenameProcess}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - folder id or error message
     */
    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {

        JsonObject requestBody = gson.fromJson(request.body(), JsonObject.class);

        FolderRenameCommand command = new FolderRenameCommand(userId,
                                                              new RecordId<>(request.params(":id")),
                                                              requestBody.get("name")
                                                                         .getAsString());

        try {
            return folderRenameProcess.handle(command)
                                      .value();

        } catch (AccessDeniedException exception) {

            response.status(403);
            return exception.getMessage();

        } catch (DataNotFoundException exception) {

            response.status(404);
            return exception.getMessage();

        }
    }

}

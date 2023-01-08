package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.CommandValidationException;
import com.teamdev.filehub.processes.foldercreate.FolderCreateCommand;
import com.teamdev.filehub.processes.foldercreate.FolderCreateProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * {@link Route} to handle folder creation path.
 */
public class CreateFolderRoute extends AuthorizedRoute {

    private Gson gson = new Gson();
    private final FolderCreateProcess folderCreateProcess;

    public CreateFolderRoute(
            UserAuthorizationView authorizationView,
            FolderCreateProcess folderCreateProcess) {
        super(authorizationView);
        this.folderCreateProcess = Preconditions.checkNotNull(folderCreateProcess);
    }

    /**
     * Parses the {@link FolderCreateCommand} from the request body
     * and handle it with the {@link FolderCreateProcess}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - created folder id
     */
    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {

        JsonObject requestBody = gson.fromJson(request.body(), JsonObject.class);

        try {

            FolderCreateCommand command =
                    new FolderCreateCommand(
                            userId,
                            new RecordId<>(requestBody.get("parentId")
                                                      .getAsString()),
                            requestBody.get("name")
                                       .getAsString()
                    );

            RecordId<String> folderId = folderCreateProcess.handle(command);
            return folderId.value();

        } catch (AccessDeniedException exception) {
            response.status(403);
            return exception.getMessage();
        } catch (CommandValidationException exception) {
            response.status(422);
            return exception.getMessage();
        }
    }
}

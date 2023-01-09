package com.teamdev.server;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.DataNotFoundException;
import com.teamdev.filehub.processes.file.rename.FileRenameCommand;
import com.teamdev.filehub.processes.file.rename.FileRenameProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import spark.Request;
import spark.Response;

/**
 * {@link AuthorizedRoute} to handle file renaming path.
 */
public class RenameFileRoute extends AuthorizedRoute {

    private final Gson gson = new Gson();
    private final FileRenameProcess renameFileProcess;

    public RenameFileRoute(
            UserAuthorizationView authorizationView,
            FileRenameProcess renameFileProcess) {
        super(authorizationView);
        this.renameFileProcess = renameFileProcess;
    }

    /**
     * Parses the {@link FileRenameCommand} from the request body
     * and handle it with the {@link FileRenameProcess}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - nothing
     */
    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {

        JsonObject requestBody = gson.fromJson(request.body(), JsonObject.class);

        FileRenameCommand command = new FileRenameCommand(userId,
                                                          new RecordId<>(request.params(":id")),
                                                          requestBody.get("name")
                                                                     .getAsString());

        try {
            return renameFileProcess.handle(command)
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

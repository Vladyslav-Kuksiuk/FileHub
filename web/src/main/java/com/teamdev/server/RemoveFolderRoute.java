package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.DataNotFoundException;
import com.teamdev.filehub.processes.folder.remove.FolderRemoveCommand;
import com.teamdev.filehub.processes.folder.remove.FolderRemoveProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import spark.Request;
import spark.Response;

/**
 * {@link AuthorizedRoute} to handle folder removing path.
 */
public class RemoveFolderRoute extends AuthorizedRoute {

    private final FolderRemoveProcess folderRemoveProcess;

    public RemoveFolderRoute(
            UserAuthorizationView authorizationView,
            FolderRemoveProcess folderRemoveProcess) {
        super(authorizationView);
        this.folderRemoveProcess = Preconditions.checkNotNull(folderRemoveProcess);
    }

    /**
     * Parses the {@link FolderRemoveCommand} from the request body
     * and handle it with the {@link FolderRemoveProcess}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - file id or error message
     */
    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {

        FolderRemoveCommand command = new FolderRemoveCommand(userId,
                                                              new RecordId<>(
                                                                      request.params(":id")));

        try {

            return folderRemoveProcess.handle(command)
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

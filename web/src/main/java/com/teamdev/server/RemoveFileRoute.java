package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.DataNotFoundException;
import com.teamdev.filehub.processes.file.remove.FileRemoveCommand;
import com.teamdev.filehub.processes.file.remove.FileRemoveProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import spark.Request;
import spark.Response;

/**
 * {@link AuthorizedRoute} to handle file removing path.
 */
public class RemoveFileRoute extends AuthorizedRoute {

    private final FileRemoveProcess fileRemoveProcess;

    public RemoveFileRoute(
            UserAuthorizationView authorizationView,
            FileRemoveProcess fileRemoveProcess) {
        super(authorizationView);
        this.fileRemoveProcess = Preconditions.checkNotNull(fileRemoveProcess);
    }

    /**
     * Parses the {@link FileRemoveCommand} from the request body
     * and handle it with the {@link FileRemoveProcess}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - file id or error message
     */
    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {

        FileRemoveCommand command = new FileRemoveCommand(userId,
                                                          new RecordId<>(request.params(":id")));

        try {

            return fileRemoveProcess.handle(command)
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

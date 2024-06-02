package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.processes.user.authentication.*;
import com.teamdev.filehub.views.file.SharedFileQuery;
import com.teamdev.filehub.views.file.SharedFileView;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import com.teamdev.server.WrappedRoute;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link WrappedRoute} implementation to provide 'user authentication' request
 * handling.
 */
public class LoadSharedFileRoute extends WrappedRoute {

    private final Gson gson = new Gson();
    private final SharedFileView process;

    public LoadSharedFileRoute(@Nonnull SharedFileView process) {
        this.process = Preconditions.checkNotNull(process);
    }

    /**
     * Handles 'user authentication' request.
     *
     * @param request
     *         The request object providing information about the HTTP request.
     * @param response
     *         The response object providing functionality for modifying the response.
     * @throws JsonEntityValidationException
     *         If JSON body can`t be processed.
     */
    @Override
    protected void wrappedRequestHandle(WrappedRequest request, Response response)
            throws JsonEntityValidationException,DataNotFoundException {

        var command = new SharedFileQuery(request.params(":tag"));

        var res = process.handle(command);

        response.body(gson.toJson(res));
    }
}

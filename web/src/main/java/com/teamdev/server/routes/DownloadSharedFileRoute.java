package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.common.io.ByteStreams;
import com.google.gson.Gson;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.views.file.SharedFileDownloadQuery;
import com.teamdev.filehub.views.file.SharedFileDownloadView;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import com.teamdev.server.WrappedRoute;
import spark.Response;

import javax.annotation.Nonnull;
import java.io.IOException;

/**
 * An {@link WrappedRoute} implementation to provide 'user authentication' request
 * handling.
 */
public class DownloadSharedFileRoute extends WrappedRoute {

    private final Gson gson = new Gson();
    private final SharedFileDownloadView view;

    public DownloadSharedFileRoute(@Nonnull SharedFileDownloadView view) {
        this.view = Preconditions.checkNotNull(view);
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

        var query = new SharedFileDownloadQuery(request.params(":tag"));

        try (var input = view.handle(query);
             var output = response.raw()
                     .getOutputStream()
        ) {

            ByteStreams.copy(input, output);

        } catch (IOException exception) {

            response.status(500);
            response.body(exception.getMessage());

        }
    }
}

package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.common.io.ByteStreams;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.download.FileDownloadQuery;
import com.teamdev.filehub.views.download.FileDownloadView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;
import java.io.IOException;
import java.io.OutputStream;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'download file' request handling.
 */
public class DownloadFileRoute extends AuthorizedUserRoute {

    private final FileDownloadView fileDownloadView;

    public DownloadFileRoute(
            @Nonnull UserAuthorizationView authorizationView,
            @Nonnull FileDownloadView fileDownloadView) {

        super(Preconditions.checkNotNull(authorizationView));
        this.fileDownloadView = Preconditions.checkNotNull(fileDownloadView);
    }

    /**
     * Handles 'download file' request.
     *
     * @param request
     *         The request object providing information about the HTTP request.
     * @param response
     *         The response object providing functionality for modifying the response.
     * @param userId
     *         Authorized user id.
     */
    @Override
    protected void authorizedHandle(WrappedRequest request, Response response,
                                    RecordId<String> userId)
            throws AccessDeniedException, DataNotFoundException {

        var query = new FileDownloadQuery(userId,
                                          new RecordId<>(request.params(":id")));

        try (var input = fileDownloadView.handle(query);
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

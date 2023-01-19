package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.upload.FileUploadCommand;
import com.teamdev.filehub.processes.upload.FileUploadProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;
import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Collection;
import java.util.LinkedList;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'upload file' request handling.
 */
public class UploadFileRoute extends AuthorizedUserRoute {

    private final Gson gson = new Gson();

    private final FileUploadProcess fileUploadProcess;

    public UploadFileRoute(
            @Nonnull UserAuthorizationView authorizationView,
            @Nonnull FileUploadProcess fileUploadProcess) {

        super(Preconditions.checkNotNull(authorizationView));
        this.fileUploadProcess = Preconditions.checkNotNull(fileUploadProcess);
    }

    /**
     * Handles 'upload file' request.
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
                                    RecordId<String> userId) throws ServiceException {

        request.attribute("org.eclipse.jetty.multipartConfig",
                          new MultipartConfigElement("/temp"));
        try {
            var parts = request.raw()
                               .getParts();

            for (var part : parts) {

                Collection<String> uploadedFilesIds = new LinkedList<>();

                try (var input = part.getInputStream()) {

                    var command = new FileUploadCommand(
                            userId,
                            new RecordId<>(request.params(":id")),
                            part.getSubmittedFileName(),
                            part.getContentType(),
                            part.getSize(),
                            input);

                    uploadedFilesIds.add(fileUploadProcess.handle(command)
                                                          .value());
                }

                response.body(gson.toJson(uploadedFilesIds));

            }
        } catch (IOException exception) {

            response.status(500);
            response.body(exception.getMessage());

        } catch (ServletException exception) {

            response.status(400);
            response.body(exception.getMessage());

        }

    }
}

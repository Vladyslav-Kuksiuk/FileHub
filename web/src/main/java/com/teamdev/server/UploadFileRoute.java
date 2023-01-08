package com.teamdev.server;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.upload.FileUploadCommand;
import com.teamdev.filehub.processes.upload.FileUploadProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import spark.Request;
import spark.Response;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;

/**
 * {@link AuthorizedRoute} to handle file uploading path.
 */
public class UploadFileRoute extends AuthorizedRoute {

    private final FileUploadProcess fileUploadProcess;

    public UploadFileRoute(
            UserAuthorizationView authorizationView,
            FileUploadProcess fileUploadProcess) {
        super(authorizationView);
        this.fileUploadProcess = fileUploadProcess;
    }

    /**
     * Parses the {@link FileUploadCommand} from the request body
     * and handle it with the {@link FileUploadProcess}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - nothing
     */
    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {
        request.attribute("org.eclipse.jetty.multipartConfig",
                          new MultipartConfigElement("/temp"));

        try {
            Collection<Part> parts = request.raw()
                                            .getParts();

            parts.forEach(part -> {
                try (InputStream input = request.raw()
                                                .getPart(part.getName())
                                                .getInputStream()
                ) {

                    FileUploadCommand command =
                            new FileUploadCommand(userId,
                                                  new RecordId<>(request.params(":id")),
                                                  part.getSubmittedFileName(),
                                                  part.getContentType(),
                                                  part.getSize(),
                                                  input);

                    fileUploadProcess.handle(command);

                } catch (IOException | ServletException exception) {

                    response.status(500);

                } catch (AccessDeniedException exception) {

                    response.status(403);
                }
            });

            return "";

        } catch (ServletException | IOException exception) {

            response.status(500);
            return exception.getMessage();
        }
    }
}

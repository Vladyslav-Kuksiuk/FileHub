package com.teamdev.server;

import com.google.common.io.ByteStreams;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AccessDeniedException;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.download.FileDownloadQuery;
import com.teamdev.filehub.views.download.FileDownloadResponse;
import com.teamdev.filehub.views.download.FileDownloadView;
import spark.Request;
import spark.Response;

import java.io.IOException;

public class DownloadFileRoute extends AuthorizedRoute {

    private final FileDownloadView fileDownloadView;

    public DownloadFileRoute(
            UserAuthorizationView authorizationView,
            FileDownloadView fileDownloadView) {
        super(authorizationView);
        this.fileDownloadView = fileDownloadView;
    }

    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {
        FileDownloadQuery query = new FileDownloadQuery(userId,
                                                        new RecordId<>(request.params(":id")));
        try {
            FileDownloadResponse file = fileDownloadView.handle(query);

            ByteStreams.copy(file.fileInput(),
                             response.raw()
                                     .getOutputStream());

            response.raw()
                    .getOutputStream()
                    .flush();

            return "";
        } catch (AccessDeniedException exception) {
            response.status(403);
            return exception.getMessage();
        } catch (IOException exception) {
            response.status(500);
            return exception.getMessage();
        }
    }
}

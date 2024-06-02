package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FilesStatistics;
import com.teamdev.filehub.views.admin.statistics.FilesStatisticsQuery;
import com.teamdev.filehub.views.admin.statistics.FilesStatisticsView;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.authorization.admin.AdminAuthorizationView;
import com.teamdev.filehub.views.folder.FolderContent;
import com.teamdev.filehub.views.folder.content.FolderContentQuery;
import com.teamdev.filehub.views.folder.content.FolderContentView;
import com.teamdev.server.AuthorizedAdminRoute;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedAdminRoute} implementation to provide 'load files statistics' request handling.
 */
public class LoadFilesStatisticsRoute extends AuthorizedAdminRoute {

    private final FilesStatisticsView filesStatisticsView;
    private final Gson gson = new Gson();

    public LoadFilesStatisticsRoute(
            @Nonnull AdminAuthorizationView authorizationView,
            @Nonnull FilesStatisticsView filesStatisticsView) {
        super(Preconditions.checkNotNull(authorizationView));
        this.filesStatisticsView = Preconditions.checkNotNull(filesStatisticsView);
    }

    /**
     * Handles 'load files statistics' request.
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
                                    RecordId userId)
            throws DataNotFoundException, AccessDeniedException {

        FilesStatisticsQuery query = new FilesStatisticsQuery(userId);

        FilesStatistics statistics = filesStatisticsView.handle(query);

        response.body(gson.toJson(statistics));
    }
}

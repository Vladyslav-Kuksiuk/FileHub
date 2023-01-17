package com.teamdev.server.routes;

import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.folderinfo.FolderInfo;
import com.teamdev.filehub.views.folderinfo.FolderInfoQuery;
import com.teamdev.filehub.views.folderinfo.FolderInfoView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'load folder' request handling.
 */
public class LoadFolderRoute extends AuthorizedUserRoute {

    private final FolderInfoView folderInfoView;
    private final Gson gson = new Gson();

    public LoadFolderRoute(
            UserAuthorizationView authorizationView,
            FolderInfoView folderInfoView) {
        super(authorizationView);
        this.folderInfoView = folderInfoView;
    }

    /**
     * Handles 'load folder' request.
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
            throws DataNotFoundException, AccessDeniedException {

        FolderInfoQuery folderInfoQuery =
                new FolderInfoQuery(userId,
                                    new RecordId<>(request.params(":id")));

        FolderInfo folderInfo = folderInfoView.handle(folderInfoQuery);
        response.body(gson.toJson(folderInfo));

    }
}

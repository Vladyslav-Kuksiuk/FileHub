package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.folder.FolderContent;
import com.teamdev.filehub.views.folder.content.FolderContentQuery;
import com.teamdev.filehub.views.folder.content.FolderContentView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'load folder content' request handling.
 */
public class LoadFolderContentRoute extends AuthorizedUserRoute {

    private final FolderContentView folderContentView;
    private final Gson gson = new Gson();

    public LoadFolderContentRoute(
            @Nonnull UserAuthorizationView authorizationView,
            @Nonnull FolderContentView folderContentView) {
        super(Preconditions.checkNotNull(authorizationView));
        this.folderContentView = Preconditions.checkNotNull(folderContentView);
    }

    /**
     * Handles 'load folder content' request.
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

        FolderContentQuery query =
                new FolderContentQuery(userId, new RecordId(request.params(":id")));

        FolderContent folderContent = folderContentView.handle(query);

        response.body(gson.toJson(folderContent));

    }
}

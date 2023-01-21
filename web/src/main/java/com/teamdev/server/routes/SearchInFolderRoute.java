package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.folder.search.FolderSearchQuery;
import com.teamdev.filehub.views.folder.search.FolderSearchView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'search in folder' request handling.
 */
public class SearchInFolderRoute extends AuthorizedUserRoute {

    private final FolderSearchView folderSearchView;
    private final Gson gson = new Gson();

    public SearchInFolderRoute(
            @Nonnull UserAuthorizationView authorizationView,
            @Nonnull FolderSearchView folderContentView) {

        super(Preconditions.checkNotNull(authorizationView));
        this.folderSearchView = Preconditions.checkNotNull(folderContentView);
    }

    /**
     * Handles 'search in folder' request.
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
            throws ServiceException, JsonEntityValidationException {

        var query = new FolderSearchQuery(
                userId,
                new RecordId(request.params(":id")),
                request.params(":searchWord"));

        var folderContent = folderSearchView.handle(query);

        response.body(gson.toJson(folderContent));

    }
}

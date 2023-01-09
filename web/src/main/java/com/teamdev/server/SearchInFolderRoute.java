package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AccessDeniedException;
import com.teamdev.filehub.views.DataNotFoundException;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.folder.FolderContent;
import com.teamdev.filehub.views.folder.content.FolderContentQuery;
import com.teamdev.filehub.views.folder.search.FolderSearchQuery;
import com.teamdev.filehub.views.folder.search.FolderSearchView;
import spark.Request;
import spark.Response;

/**
 * {@link AuthorizedRoute} to handle folder content path.
 */
public class SearchInFolderRoute extends AuthorizedRoute {

    private final FolderSearchView folderSearchView;
    private final Gson gson = new Gson();

    public SearchInFolderRoute(
            UserAuthorizationView authorizationView,
            FolderSearchView folderContentView) {
        super(authorizationView);
        this.folderSearchView = Preconditions.checkNotNull(folderContentView);
    }

    /**
     * Parses the {@link FolderContentQuery} from the request body
     * and handle it with the {@link FolderSearchView}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - {@link FolderContent} as JSON
     */
    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {

        FolderSearchQuery query =
                new FolderSearchQuery(userId,
                                      new RecordId<>(request.params(":id")),
                                      request.params(":searchWord"));

        try {

            FolderContent folderContent = folderSearchView.handle(query);
            return gson.toJson(folderContent);

        } catch (AccessDeniedException exception) {

            response.status(403);
            return exception.getMessage();

        } catch (DataNotFoundException exception) {

            response.status(404);
            return exception.getMessage();

        }
    }
}

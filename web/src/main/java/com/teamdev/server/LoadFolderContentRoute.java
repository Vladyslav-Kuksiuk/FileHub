package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AccessDeniedException;
import com.teamdev.filehub.views.DataNotFoundException;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.folder.FolderContent;
import com.teamdev.filehub.views.folder.content.FolderContentQuery;
import com.teamdev.filehub.views.folder.content.FolderContentView;
import com.teamdev.filehub.views.folder.info.FolderInfo;
import spark.Request;
import spark.Response;

/**
 * {@link AuthorizedRoute} to handle folder content path.
 */
public class LoadFolderContentRoute extends AuthorizedRoute {

    private final FolderContentView folderContentView;
    private final Gson gson = new Gson();

    public LoadFolderContentRoute(
            UserAuthorizationView authorizationView,
            FolderContentView folderContentView) {
        super(authorizationView);
        this.folderContentView = Preconditions.checkNotNull(folderContentView);
    }

    /**
     * Parses the {@link FolderContentQuery} from the request body
     * and handle it with the {@link FolderContentView}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - {@link FolderInfo} as JSON
     */
    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {

        FolderContentQuery query =
                new FolderContentQuery(userId, new RecordId<>(request.params(":id")));

        try {

            FolderContent folderContent = folderContentView.handle(query);
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

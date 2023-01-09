package com.teamdev.server;

import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AccessDeniedException;
import com.teamdev.filehub.views.DataNotFoundException;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.folder.info.FolderInfo;
import com.teamdev.filehub.views.folder.info.FolderInfoQuery;
import com.teamdev.filehub.views.folder.info.FolderInfoView;
import spark.Request;
import spark.Response;

/**
 * {@link AuthorizedRoute} to handle folder info path.
 */
public class LoadFolderRoute extends AuthorizedRoute {

    private final FolderInfoView folderInfoView;
    private final Gson gson = new Gson();

    public LoadFolderRoute(
            UserAuthorizationView authorizationView,
            FolderInfoView folderInfoView) {
        super(authorizationView);
        this.folderInfoView = folderInfoView;
    }

    /**
     * Parses the {@link FolderInfoQuery} from the request body
     * and handle it with the {@link FolderInfoView}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - {@link FolderInfo} as JSON
     */
    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {

        FolderInfoQuery folderInfoQuery =
                new FolderInfoQuery(userId,
                                    new RecordId<>(request.params(":id")));

        try {

            FolderInfo folderInfo = folderInfoView.handle(folderInfoQuery);
            return gson.toJson(folderInfo);

        } catch (AccessDeniedException error) {

            response.status(403);
            return error.getMessage();

        } catch (DataNotFoundException error) {

            response.status(404);
            return error.getMessage();

        }
    }
}

package com.teamdev.server;

import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.userprofile.UserProfile;
import com.teamdev.filehub.views.userprofile.UserProfileQuery;
import com.teamdev.filehub.views.userprofile.UserProfileView;
import spark.Request;
import spark.Response;

/**
 * {@link AuthorizedRoute} to handle user profile path.
 */
public class LoadUserRoute extends AuthorizedRoute {

    private final Gson gson = new Gson();
    private final UserProfileView userProfileView;

    public LoadUserRoute(UserAuthorizationView authorizationView,
                         UserProfileView userProfileView) {

        super(authorizationView);
        this.userProfileView = userProfileView;
    }

    /**
     * Parses the {@link UserProfileQuery} from the request body
     * and handle it with the {@link UserProfileView}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - {@link UserProfile} as JSON
     */
    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {

        UserProfile userProfile = userProfileView.handle(new UserProfileQuery(userId));
        response.status(200);
        return gson.toJson(userProfile);
    }
}

package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.userprofile.UserProfile;
import com.teamdev.filehub.views.userprofile.UserProfileQuery;
import com.teamdev.filehub.views.userprofile.UserProfileView;

/**
 * {@link AuthorizedUserRoute} to handle user profile path.
 */
public class LoadUserRoute extends AuthorizedUserRoute {

    private final Gson gson = new Gson();
    private final UserProfileView userProfileView;

    LoadUserRoute(UserAuthorizationView authorizationView,
                  UserProfileView userProfileView) {

        super(Preconditions.checkNotNull(authorizationView));
        this.userProfileView = Preconditions.checkNotNull(userProfileView);
    }

    /**
     * Parses the {@link UserProfileQuery} from the request body
     * and handle it with the {@link UserProfileView}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     */
    @Override
    protected void authorizedHandle(WrappedRequest request, WrappedResponse response,
                                    RecordId<String> userId) {

        UserProfile userProfile = userProfileView.handle(new UserProfileQuery(userId));
        response.setBody(gson.toJson(userProfile));
    }
}

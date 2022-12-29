package com.teamdev.server;

import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.userprofile.UserProfile;
import com.teamdev.filehub.views.userprofile.UserProfileQuery;
import com.teamdev.filehub.views.userprofile.UserProfileView;
import spark.Request;
import spark.Response;

public class LoadUserRoute extends AuthorizedRoute {
    private final Gson gson = new Gson();
    private final UserProfileView userProfileView;


    public LoadUserRoute(UserAuthorizationView authorizationView,
                         UserProfileView userProfileView) {
        super(authorizationView);
        this.userProfileView = userProfileView;
    }

    @Override
    public Object authorizedHandle(Request request, Response response, RecordId<String> userId) {
        UserProfile userProfile = userProfileView.handle(new UserProfileQuery(userId));
        return gson.toJson(userProfile);
    }
}

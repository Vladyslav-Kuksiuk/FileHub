package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.userprofile.UserProfile;
import com.teamdev.filehub.views.userprofile.UserProfileQuery;
import com.teamdev.filehub.views.userprofile.UserProfileView;
import com.teamdev.server.AuthorizedUserRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedUserRoute} implementation to provide 'load user profile' request handling.
 */
public class LoadUserRoute extends AuthorizedUserRoute {

    private final Gson gson = new Gson();
    private final UserProfileView userProfileView;

    public LoadUserRoute(@Nonnull UserAuthorizationView authorizationView,
                         @Nonnull UserProfileView userProfileView) {

        super(Preconditions.checkNotNull(authorizationView));
        this.userProfileView = Preconditions.checkNotNull(userProfileView);
    }

    /**
     * Handles 'load user profile' request.
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
                                    RecordId userId) {
        UserProfile userProfile = userProfileView.handle(new UserProfileQuery(userId));
        response.body(gson.toJson(userProfile));
    }
}

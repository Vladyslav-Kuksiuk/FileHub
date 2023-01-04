package com.teamdev.server;

import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.userprofile.UserProfile;
import com.teamdev.filehub.views.userprofile.UserProfileQuery;
import com.teamdev.filehub.views.userprofile.UserProfileView;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.mockito.ArgumentMatchers.any;

public class LoadUserRouteTest {

    private final Gson gson = new Gson();

    @Test
    @DisplayName("Should return user profile")
    void shouldReturnUserProfile() {
        Request request = Mockito.mock(Request.class);
        Response response = Mockito.mock(Response.class);
        UserAuthorizationView authorizationView = Mockito.mock(UserAuthorizationView.class);
        UserProfileView userProfileView = Mockito.mock((UserProfileView.class));

        UserProfile userProfile = new UserProfile("userProfile", "folderId");

        LoadUserRoute route = new LoadUserRoute(authorizationView, userProfileView);

        Mockito.when(userProfileView.handle(any(UserProfileQuery.class)))
               .thenReturn(userProfile);

        assertWithMessage("")
                .that(route.authorizedHandle(request, response, new RecordId<>("user")))
                .isEqualTo(gson.toJson(userProfile));

    }

}

package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;
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

class LoadUserRouteTest {

    private final Gson gson = new Gson();

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(LoadUserRoute.class);

    }

    @Test
    @DisplayName("Should set UserAuthenticationResponse as JSON string in response body")
    void testHandleWithoutExceptions() throws UserAuthorizationException {

        var userId = new RecordId<>("userId");

        var userProfile = new UserProfile("login", "rootFolderId");
        var responseJsonString = gson.toJson(userProfile);

        var request = Mockito.mock(Request.class);
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");

        var response = Mockito.mock(Response.class);
        Mockito.when(response.body())
               .thenReturn(responseJsonString);

        var authView = Mockito.mock(UserAuthorizationView.class);
        Mockito.when(authView.handle(any()))
               .thenReturn(userId);

        var userProfileView = new UserProfileView() {

            @Override
            public UserProfile handle(UserProfileQuery query) {
                if (!query.userId()
                          .equals(userId)) {
                    throw new RuntimeException("");
                }
                return userProfile;
            }
        };

        var route = new LoadUserRoute(authView, userProfileView);

        assertWithMessage("Route handle did not return user profile")
                .that(route.handle(request, response))
                .isEqualTo(responseJsonString);
        Mockito.verify(response, Mockito.times(1))
               .body(responseJsonString);

    }

}

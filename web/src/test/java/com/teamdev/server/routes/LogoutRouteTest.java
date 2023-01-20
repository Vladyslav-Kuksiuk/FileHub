package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.user.logout.UserLogoutCommand;
import com.teamdev.filehub.processes.user.logout.UserLogoutProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.mockito.ArgumentMatchers.any;

class LogoutRouteTest {

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(LogoutRoute.class);

    }

    @Test
    @DisplayName("Should set user id as string in response body")
    void testHandleWithoutExceptions() throws UserAuthorizationException {

        var userId = new RecordId<>("userId");

        var request = Mockito.mock(Request.class);
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");

        var response = Mockito.mock(Response.class);
        Mockito.when(response.body())
               .thenReturn(userId.value());

        var authView = Mockito.mock(UserAuthorizationView.class);
        Mockito.when(authView.handle(any()))
               .thenReturn(userId);

        var userLogoutProcess = new UserLogoutProcess() {

            @Override
            public RecordId<String> handle(UserLogoutCommand command) {
                assertWithMessage("Command user id is different.")
                        .that(command.userId())
                        .isEqualTo(userId);

                return userId;
            }
        };

        var route = new LogoutRoute(authView, userLogoutProcess);

        assertWithMessage("Route handle did not return user id")
                .that(route.handle(request, response))
                .isEqualTo(userId.value());
        Mockito.verify(response, Mockito.times(1))
               .body(userId.value());

    }

}

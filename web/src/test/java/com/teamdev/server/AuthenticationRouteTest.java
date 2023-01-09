package com.teamdev.server;

import com.google.gson.Gson;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationResponse;
import com.teamdev.filehub.processes.user.authentication.UserDataMismatchException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import static com.google.common.truth.Truth.assertWithMessage;

public class AuthenticationRouteTest {

    private final Gson gson = new Gson();

    @Test
    @DisplayName("Should successfully authenticate user")
    void shouldSuccessfullyAuthenticateUser() {
        UserAuthenticationResponse authResponse = new UserAuthenticationResponse("token");
        AuthenticationRoute route = new AuthenticationRoute(command -> authResponse);

        Request request = Mockito.mock(Request.class);
        Response response = Mockito.mock(Response.class);

        Mockito.when(request.body())
               .thenReturn("{\"login\": \"user@gmail.com\", \"password\": \"password\"}");

        assertWithMessage("User authentication route failed.")
                .that(route.handle(request, response))
                .isEqualTo(gson.toJson(authResponse));

        Mockito.verify(response, Mockito.times(1))
               .status(200);

    }

    @Test
    @DisplayName("Should fail user authentication with UserDataMismatchException | code 401")
    void shouldFailUseAuthenticationWithDataMismatch() {
        String errorMessage = "error";
        AuthenticationRoute route = new AuthenticationRoute(command -> {
            throw new UserDataMismatchException(errorMessage);
        });

        Request request = Mockito.mock(Request.class);
        Response response = Mockito.mock(Response.class);

        Mockito.when(request.body())
               .thenReturn("{\"login\": \"user\", \"password\": \"password\"}");

        assertWithMessage("User authentication route failed.")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(401);

    }
}

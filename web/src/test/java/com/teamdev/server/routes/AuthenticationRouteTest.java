package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import com.teamdev.filehub.processes.authentication.UserAuthenticationCommand;
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.authentication.UserAuthenticationResponse;
import com.teamdev.filehub.processes.authentication.UserCredentialsMismatchException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import java.util.Objects;

import static com.google.common.truth.Truth.assertWithMessage;

class AuthenticationRouteTest {

    private final Gson gson = new Gson();

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(AuthenticationRoute.class);

    }

    @Test
    @DisplayName("Should set UserAuthenticationResponse as JSON string in response body")
    void testHandleWithoutExceptions() {

        var login = "userLogin";
        var password = "userPassword";
        var authenticationResponse = new UserAuthenticationResponse("token");
        var responseJsonString = gson.toJson(authenticationResponse);

        var request = Mockito.mock(Request.class);
        Mockito.when(request.contentType())
               .thenReturn("application/json");
        Mockito.when(request.body())
               .thenReturn("{\"login\":\"" + login + "\",\"password\":\"" + password + "\"}");

        var response = Mockito.mock(Response.class);
        Mockito.when(response.body())
               .thenReturn(responseJsonString);

        var process = new UserAuthenticationProcess() {

            @Override
            public UserAuthenticationResponse handle(UserAuthenticationCommand command)
                    throws UserCredentialsMismatchException {

                if (!Objects.equals(command.login(), login) ||
                        !Objects.equals(command.password(), password)) {

                    throw new UserCredentialsMismatchException("");

                }

                return authenticationResponse;
            }
        };

        var route = new AuthenticationRoute(process);

        assertWithMessage("Route handle did not return an authentication response")
                .that(route.handle(request, response))
                .isEqualTo(responseJsonString);
        Mockito.verify(response, Mockito.times(1))
               .body(responseJsonString);

    }

    @Test
    @DisplayName("Should catch UserCredentialsMismatchException and set 401 response status")
    void testHandleWithUserCredentialsMismatchException() {

        var errorMessage = "errorMessage";

        var request = Mockito.mock(Request.class);
        Mockito.when(request.contentType())
               .thenReturn("application/json");
        Mockito.when(request.body())
               .thenReturn("{\"login\":\"login\",\"password\":\"password\"}");

        var response = Mockito.mock(Response.class);

        var process = new UserAuthenticationProcess() {

            @Override
            public UserAuthenticationResponse handle(UserAuthenticationCommand command)
                    throws UserCredentialsMismatchException {

                throw new UserCredentialsMismatchException(errorMessage);
            }
        };

        var route = new AuthenticationRoute(process);

        assertWithMessage("Route handle did not return an error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(401);

    }

    @Test
    @DisplayName("Should catch JsonEntityValidationException and set 400 response status")
    void testHandleWithJsonEntityValidationException() {

        var request = Mockito.mock(Request.class);
        Mockito.when(request.contentType())
               .thenReturn("application/json");
        Mockito.when(request.body())
               .thenReturn("{\"login\":\"login\"}");

        var response = Mockito.mock(Response.class);

        var process = new UserAuthenticationProcess() {

            @Override
            public UserAuthenticationResponse handle(UserAuthenticationCommand command) {
                return null;
            }
        };

        var route = new AuthenticationRoute(process);

        assertWithMessage("Route handle did not return an error message")
                .that(route.handle(request, response))
                .isEqualTo("Field password not found in JSON");

        Mockito.verify(response, Mockito.times(1))
               .status(400);

    }
}

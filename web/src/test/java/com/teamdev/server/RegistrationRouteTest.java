package com.teamdev.server;

import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.user.register.UserAlreadyRegisteredException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import static com.google.common.truth.Truth.assertWithMessage;

class RegistrationRouteTest {

    private final Gson gson = new Gson();

    @Test
    @DisplayName("Should successfully register user")
    void shouldSuccessfullyRegisterUser() {
        RecordId<String> userId = new RecordId<>("userId");
        RegistrationRoute route = new RegistrationRoute(command -> userId);

        Request request = Mockito.mock(Request.class);
        Response response = Mockito.mock(Response.class);

        Mockito.when(request.body())
               .thenReturn("{\"login\": \"user@gmail.com\", \"password\": \"password1\"}");

        assertWithMessage("User registration route failed.")
                .that(route.handle(request, response))
                .isEqualTo(gson.toJson(userId));

        Mockito.verify(response, Mockito.times(1))
               .status(200);

    }

    @Test
    @DisplayName("Should fail user registration with InvalidFieldException | code 422")
    void shouldFailUserRegistrationWithInvalidEmail() {
        RegistrationRoute route = new RegistrationRoute(command -> null);

        Request request = Mockito.mock(Request.class);
        Response response = Mockito.mock(Response.class);

        Mockito.when(request.body())
               .thenReturn("{\"login\": \"user\", \"password\": \"password\"}");

        assertWithMessage("User registration route failed.")
                .that(route.handle(request, response))
                .isEqualTo(
                        "{\"errors\":[{\"fieldName\":\"email\",\"errorText\":\"Email validation failed.\"}]}");

        Mockito.verify(response, Mockito.times(1))
               .status(422);

    }

    @Test
    @DisplayName("Should fail user registration with UserAlreadyRegisteredException | code 409")
    void shouldFailUserRegistrationWithExistenceException() {
        String errorMessage = "error";
        RegistrationRoute route =
                new RegistrationRoute(command -> {
                    throw new UserAlreadyRegisteredException(errorMessage);
                });

        Request request = Mockito.mock(Request.class);
        Response response = Mockito.mock(Response.class);

        Mockito.when(request.body())
               .thenReturn("{\"login\": \"user@gmail.com\", \"password\": \"password1\"}");

        assertWithMessage("User registration route failed.")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(409);

    }
}

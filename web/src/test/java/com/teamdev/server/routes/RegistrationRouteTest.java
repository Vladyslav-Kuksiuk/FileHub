package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.register.UserAlreadyRegisteredException;
import com.teamdev.filehub.processes.register.UserRegistrationCommand;
import com.teamdev.filehub.processes.register.UserRegistrationProcess;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import java.util.Objects;

import static com.google.common.truth.Truth.assertWithMessage;

class RegistrationRouteTest {

    private final Gson gson = new Gson();

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(RegistrationRoute.class);

    }

    @Test
    @DisplayName("Should set userId as string in response body")
    void testHandleWithoutExceptions() {

        var login = "userLogin@gmail.com";
        var password = "userPassword123";
        var userId = new RecordId<>("userId");

        var request = Mockito.mock(Request.class);
        Mockito.when(request.contentType())
               .thenReturn("application/json");
        Mockito.when(request.body())
               .thenReturn("{\"login\":\"" + login + "\",\"password\":\"" + password + "\"}");

        var response = Mockito.mock(Response.class);
        Mockito.when(response.body())
               .thenReturn(userId.value());

        var process = new UserRegistrationProcess() {

            @Override
            public RecordId<String> handle(UserRegistrationCommand command) {

                if (!Objects.equals(command.login(), login) ||
                        !Objects.equals(command.password(), password)) {

                    throw new RuntimeException("");

                }

                return userId;
            }
        };

        var route = new RegistrationRoute(process);

        assertWithMessage("Route handle did not return userId")
                .that(route.handle(request, response))
                .isEqualTo(userId.value());
        Mockito.verify(response, Mockito.times(1))
               .body(userId.value());

    }

    @Test
    @DisplayName("Should catch UserAlreadyRegisteredException and set 409 response status")
    void testHandleWithUserAlreadyRegisteredException() {

        var errorMessage = "errorMessage";

        var request = Mockito.mock(Request.class);
        Mockito.when(request.contentType())
               .thenReturn("application/json");
        Mockito.when(request.body())
               .thenReturn("{\"login\":\"login@gmail.com\",\"password\":\"password123\"}");

        var response = Mockito.mock(Response.class);

        var process = new UserRegistrationProcess() {

            @Override
            public RecordId<String> handle(UserRegistrationCommand command) throws
                                                                            UserAlreadyRegisteredException {
                throw new UserAlreadyRegisteredException(errorMessage);
            }
        };

        var route = new RegistrationRoute(process);

        assertWithMessage("Route handle did not return an error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(409);

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

        var process = new UserRegistrationProcess() {

            @Override
            public RecordId<String> handle(UserRegistrationCommand command) {
                return null;
            }
        };

        var route = new RegistrationRoute(process);

        assertWithMessage("Route handle did not return an error message")
                .that(route.handle(request, response))
                .isEqualTo("Field password not found in JSON");

        Mockito.verify(response, Mockito.times(1))
               .status(400);

    }

    @Test
    @DisplayName("Should catch FieldValidationException and set 422 response status")
    void testHandleWithFieldValidationException() {

        var errorResponse = "{\"errors\":[{\"errorText\":\"Email validation failed.\",\"fieldName\":\"email\"}]}";

        var request = Mockito.mock(Request.class);
        Mockito.when(request.contentType())
               .thenReturn("application/json");
        Mockito.when(request.body())
               .thenReturn("{\"login\":\"login\",\"password\":\"password123\"}");

        var response = Mockito.mock(Response.class);
        Mockito.when(response.body())
               .thenReturn(errorResponse);

        var process = new UserRegistrationProcess() {

            @Override
            public RecordId<String> handle(UserRegistrationCommand command) {
                throw new RuntimeException("");
            }
        };

        var route = new RegistrationRoute(process);

        assertWithMessage("Route handle did not return an error message")
                .that(route.handle(request, response))
                .isEqualTo(errorResponse);

        Mockito.verify(response)
               .status(422);
        Mockito.verify(response)
               .body(errorResponse);

    }

}

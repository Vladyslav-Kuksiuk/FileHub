package com.teamdev.server;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UnauthorizedUserException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import static com.google.common.truth.Truth.assertWithMessage;

public class AuthorizedRouteTest {

    @Test
    @DisplayName("Should return authorized user id")
    void shouldReturnAuthorizedUserId() {

        RecordId<String> userId = new RecordId<>("userId");
        String token = "token";
        Request request = Mockito.mock(Request.class);
        Response response = Mockito.mock(Response.class);

        AuthorizedRoute authorizedRoute = new AuthorizedRoute(query -> {
            if (query.authorizationToken()
                     .equals(token)) {
                return userId;
            }
            return null;
        }) {
            @Override
            protected Object authorizedHandle(Request request, Response response,
                                              RecordId<String> userId) {
                return userId;
            }
        };

        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer " + token);

        assertWithMessage("User authentication failed")
                .that(authorizedRoute.handle(request, response))
                .isEqualTo(userId);
    }

    @Test
    @DisplayName("Should throw UnauthorizedUserException")
    void shouldThrowUnauthorizedUserException() {

        RecordId<String> userId = new RecordId<>("userId");
        String errorMessage = "errorMessage";
        Request request = Mockito.mock(Request.class);
        Response response = Mockito.mock(Response.class);

        AuthorizedRoute authorizedRoute = new AuthorizedRoute(query -> {
            throw new UnauthorizedUserException(errorMessage);
        }) {
            @Override
            protected Object authorizedHandle(Request request, Response response,
                                              RecordId<String> userId) {
                return null;
            }
        };

        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");

        assertWithMessage("User authentication failed")
                .that(authorizedRoute.handle(request, response))
                .isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(401);

    }

}

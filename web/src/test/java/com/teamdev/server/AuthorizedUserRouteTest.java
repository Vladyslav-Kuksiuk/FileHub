package com.teamdev.server;

import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;
import com.teamdev.filehub.views.authorization.UserAuthorizationQuery;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Response;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertThrows;

class AuthorizedUserRouteTest {

    @Test
    @DisplayName("Should return user id after authorization")
    void testHandleWithoutExceptions() throws ServiceException, JsonEntityValidationException {
        var userId = "userId";
        var token = "token";

        var request = Mockito.mock(WrappedRequest.class);
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer " + token);

        var response = Mockito.mock(Response.class);

        var authView = new UserAuthorizationView() {
            @Override
            public RecordId<String> handle(UserAuthorizationQuery query)
                    throws UserAuthorizationException {

                if (!Objects.equals(query.authorizationToken(), token)) {

                    throw new UserAuthorizationException("");

                }

                return new RecordId<>(userId);
            }
        };

        var route = new AuthorizedUserRoute(authView) {
            @Override
            protected void authorizedHandle(WrappedRequest request,
                                            Response response,
                                            RecordId<String> userId) {
                response.body(userId.value());
            }
        };

        route.wrappedRequestHandle(request, response);

        Mockito.verify(response, Mockito.times(1))
               .body(userId);

    }

    @Test
    @DisplayName("Should throw AccessDeniedException after authorization try")
    void testHandleWithAccessDeniedException() {
        var userId = "userId";
        var token = "token";

        var request = Mockito.mock(WrappedRequest.class);
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer " + token);

        var response = Mockito.mock(Response.class);

        var authView = new UserAuthorizationView() {
            @Override
            public RecordId<String> handle(UserAuthorizationQuery query)
                    throws UserAuthorizationException {

                throw new UserAuthorizationException("");
            }
        };

        var route = new AuthorizedUserRoute(authView) {
            @Override
            protected void authorizedHandle(WrappedRequest request,
                                            Response response,
                                            RecordId<String> userId) {
                response.body(userId.value());
            }
        };

        assertThrows(UserAuthorizationException.class, () -> {
            route.wrappedRequestHandle(request, response);
        }, "AccessDeniedException was not thrown");

    }

}

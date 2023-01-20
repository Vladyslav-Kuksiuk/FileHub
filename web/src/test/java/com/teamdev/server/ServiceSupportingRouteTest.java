package com.teamdev.server;

import com.teamdev.filehub.ServiceException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import static com.google.common.truth.Truth.assertWithMessage;

class ServiceSupportingRouteTest {

    @Test
    @DisplayName("Should return response body")
    void testHandleWithoutExceptions() {
        var responseBody = "responseBody";

        var request = Mockito.mock(Request.class);
        var response = Mockito.mock(Response.class);

        Mockito.when(response.body())
               .thenReturn(responseBody);

        var route = new ServiceSupportingRoute() {
            @Override
            protected void wrappedRequestHandle(WrappedRequest request, Response response) {
                response.body(responseBody);
            }
        };

        assertWithMessage("Route handle did not return correct response body")
                .that(route.handle(request, response))
                .isEqualTo(responseBody);

        Mockito.verify(response, Mockito.times(1))
               .body(responseBody);

    }

    @Test
    @DisplayName("Should catch ServiceException, return it message and set status into response")
    void testHandleWithServiceException() {
        var errorMessage = "errorMessage";

        var request = Mockito.mock(Request.class);
        var response = Mockito.mock(Response.class);

        var route = new ServiceSupportingRoute() {
            @Override
            protected void wrappedRequestHandle(WrappedRequest request, Response response)
                    throws ServiceException {
                throw new ServiceException(errorMessage);
            }
        };

        assertWithMessage("Route handle did not return correct error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(500);

    }

    @Test
    @DisplayName("Should catch JsonEntityValidationException, return it message and set status into response")
    void testHandleWithJsonEntityValidationException() {
        var errorMessage = "errorMessage";

        var request = Mockito.mock(Request.class);
        var response = Mockito.mock(Response.class);

        var route = new ServiceSupportingRoute() {
            @Override
            protected void wrappedRequestHandle(WrappedRequest request, Response response)
                    throws JsonEntityValidationException {
                throw new JsonEntityValidationException(errorMessage);
            }
        };

        assertWithMessage("Route handle did not return correct error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(400);

    }

}

package com.teamdev.server;

import com.teamdev.filehub.ServiceException;
import spark.Request;
import spark.Response;
import spark.Route;

public abstract class WrappedRoute implements Route {

    @Override
    public final Object handle(Request request, Response response) {

        try {

            WrappedRequest wrappedRequest = new WrappedRequest(request);
            WrappedResponse wrappedResponse = new WrappedResponse(response);
            wrappedHandle(wrappedRequest, wrappedResponse);

            return wrappedResponse.body();

        } catch (ServiceException | JsonEntityValidationException exception) {
            ExceptionStatusFactory exceptionStatusFactory = new ExceptionStatusFactory();

            response.status(exceptionStatusFactory.getStatus(exception.getClass()));

            return exception.getMessage();

        }
    }

    protected abstract void wrappedHandle(WrappedRequest request, WrappedResponse response)
            throws ServiceException, JsonEntityValidationException;
}

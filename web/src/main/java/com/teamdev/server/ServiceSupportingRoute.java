package com.teamdev.server;

import com.google.gson.JsonSyntaxException;
import com.teamdev.filehub.ServiceException;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * An abstract implementation of {@link Route} with more convenient API to work with services.
 * The main functionality is catching {@link ServiceException} and JSON related exceptions
 * to convert them into {@link Response} with correct HTTP status.
 * Wraps {@link Request} to improve work with body as JSON.
 */
public abstract class ServiceSupportingRoute implements Route {

    /**
     * Handles {@link Request} to modify and provide {@link Response}.
     * You may need to use this method to handle route's corresponding path.
     *
     * @param request
     *         The request object providing information about the HTTP request.
     * @param response
     *         The response object providing functionality for modifying the response.
     * @return {@link Response} body.
     */
    @Override
    public final String handle(Request request, Response response) {

        try {

            WrappedRequest wrappedRequest = new WrappedRequest(request);
            wrappedRequestHandle(wrappedRequest, response);

            return response.body();

        } catch (ServiceException | JsonEntityValidationException | JsonSyntaxException exception) {
            ExceptionStatusFactory exceptionStatusFactory = new ExceptionStatusFactory();

            response.status(exceptionStatusFactory.getStatus(exception.getClass()));

            return exception.getMessage();

        }
    }

    /**
     * Handles {@link WrappedRequest} to modify and provide {@link Response}.
     * You must override this method to write own ServiceSupportingRoute.
     *
     * @param request
     *         The request object providing information about the HTTP request.
     * @param response
     *         The response object providing functionality for modifying the response.
     * @throws ServiceException
     *         If service handles request with exception.
     * @throws JsonEntityValidationException
     *         If JSON body can`t be processed.
     */
    protected abstract void wrappedRequestHandle(WrappedRequest request, Response response)
            throws ServiceException, JsonEntityValidationException;
}

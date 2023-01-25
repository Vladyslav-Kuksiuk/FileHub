package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.ServiceException;
import spark.Request;
import spark.Response;
import spark.Route;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * Abstract implementation of {@link Route} to provide {@link Request} wrapping in {@link
 * WrappedRequest}
 * and response HTTP status binding to caught {@link Exception} .
 */
public abstract class WrappedRoute implements Route {

    /**
     * Handles {@link Request} to modify and provide {@link Response}.
     * You may need to use this method to handle route's corresponding path.
     *
     * Wraps {@link Request} to improve work with body as JSON.
     * Calls {@link #wrappedRequestHandle(WrappedRequest, Response)}.
     * Catching {@link Exception} and convert it into {@link Response} with correct HTTP status.
     *
     * @param request
     *         The request object providing information about the HTTP request.
     * @param response
     *         The response object providing functionality for modifying the response.
     * @return {@link Response} body.
     */
    @Override
    public final String handle(@Nonnull Request request, @Nonnull Response response) {
        Preconditions.checkNotNull(request);
        Preconditions.checkNotNull(response);

        try {

            WrappedRequest wrappedRequest = new WrappedRequest(request);
            wrappedRequestHandle(wrappedRequest, response);

            return Optional.ofNullable(response.body())
                           .orElse("");

        } catch (Exception exception) {

            exception.printStackTrace();

            ExceptionToStatusBinding exceptionStatusFactory = new ExceptionToStatusBinding();

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

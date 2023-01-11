package com.teamdev.server.routes;

import com.google.gson.Gson;
import com.teamdev.filehub.processes.authentication.UserAuthenticationCommand;
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.authentication.UserAuthenticationResponse;
import com.teamdev.filehub.processes.authentication.UserDataMismatchException;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.ServiceSupportingRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

/**
 * An {@link ServiceSupportingRoute} implementation to provide 'user authentication' request
 * handling.
 */
public class AuthenticationRoute extends ServiceSupportingRoute {

    private final Gson gson = new Gson();
    private final UserAuthenticationProcess process;

    public AuthenticationRoute(UserAuthenticationProcess process) {
        this.process = process;
    }

    /**
     * Handles 'user authentication' request.
     *
     * @param request
     *         The request object providing information about the HTTP request.
     * @param response
     *         The response object providing functionality for modifying the response.
     * @throws JsonEntityValidationException
     *         If JSON body can`t be processed.
     * @throws UserDataMismatchException
     *         If user credentials fail verification.
     */
    @Override
    protected void wrappedRequestHandle(WrappedRequest request, Response response)
            throws JsonEntityValidationException, UserDataMismatchException {

        UserAuthenticationCommand command =
                new UserAuthenticationCommand(
                        request.jsonBody()
                               .getAsString("login"),
                        request.jsonBody()
                               .getAsString("password"));

        UserAuthenticationResponse authResponse = process.handle(command);

        response.body(gson.toJson(authResponse));
    }
}

package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationCommand;
import com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationProcess;
import com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationResponse;
import com.teamdev.filehub.processes.user.authentication.*;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import com.teamdev.server.WrappedRoute;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link WrappedRoute} implementation to provide 'user authentication' request
 * handling.
 */
public class AdminAuthenticationRoute extends WrappedRoute {

    private final Gson gson = new Gson();
    private final AdminAuthenticationProcess process;

    public AdminAuthenticationRoute(@Nonnull AdminAuthenticationProcess process) {
        this.process = Preconditions.checkNotNull(process);
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
     * @throws UserCredentialsMismatchException
     *         If user credentials fail verification.
     */
    @Override
    protected void wrappedRequestHandle(WrappedRequest request, Response response)
            throws JsonEntityValidationException, UserCredentialsMismatchException, UserEmailNotConfirmedException {

        AdminAuthenticationCommand command = new AdminAuthenticationCommand(
                        request.jsonBody()
                               .getAsString("login"),
                        request.jsonBody()
                               .getAsString("password"));

        AdminAuthenticationResponse authResponse = process.handle(command);

        response.body(gson.toJson(authResponse));
    }
}

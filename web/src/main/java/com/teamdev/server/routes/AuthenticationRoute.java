package com.teamdev.server.routes;

import com.google.gson.Gson;
import com.teamdev.filehub.processes.authentication.UserAuthenticationCommand;
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.authentication.UserAuthenticationResponse;
import com.teamdev.filehub.processes.authentication.UserDataMismatchException;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import com.teamdev.server.WrappedResponse;
import com.teamdev.server.WrappedRoute;

public class AuthenticationRoute extends WrappedRoute {

    private final Gson gson = new Gson();
    private final UserAuthenticationProcess process;

    public AuthenticationRoute(UserAuthenticationProcess process) {
        this.process = process;
    }

    @Override
    protected void wrappedHandle(WrappedRequest request, WrappedResponse response)
            throws JsonEntityValidationException, UserDataMismatchException {

        UserAuthenticationCommand command =
                new UserAuthenticationCommand(
                        request.jsonBody()
                               .getAsString("login"),
                        request.jsonBody()
                               .getAsString("password"));

        UserAuthenticationResponse authResponse = process.handle(command);
        response.setBody(gson.toJson(authResponse));

    }
}

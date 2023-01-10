package com.teamdev.server;

import com.google.gson.Gson;
import com.teamdev.filehub.processes.authentication.UserAuthenticationCommand;
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.authentication.UserAuthenticationResponse;
import com.teamdev.filehub.processes.authentication.UserDataMismatchException;

public class AuthenticationRoute extends WrappedRoute {

    Gson gson = new Gson();
    UserAuthenticationProcess process;

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

    }
}

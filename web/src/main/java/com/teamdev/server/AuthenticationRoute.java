package com.teamdev.server;

import com.google.gson.Gson;
import com.teamdev.filehub.processes.authentication.UserAuthenticationCommand;
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.authentication.UserAuthenticationResponse;
import com.teamdev.filehub.processes.authentication.UserDataMismatchException;
import spark.Request;
import spark.Response;
import spark.Route;

public class AuthenticationRoute implements Route {
    Gson gson = new Gson();
    UserAuthenticationProcess process;

    public AuthenticationRoute(UserAuthenticationProcess process) {
        this.process = process;
    }

    @Override
    public Object handle(Request request, Response response) {
        try {
            UserAuthenticationCommand command = gson.fromJson(request.body(), UserAuthenticationCommand.class);
            UserAuthenticationResponse authResponse = process.handle(command);
            response.status(200);
            return gson.toJson(authResponse);

        } catch (UserDataMismatchException e) {
            response.status(401);
            return gson.toJson(e.getMessage());
        }
    }
}

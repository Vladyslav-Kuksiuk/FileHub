package com.teamdev.server;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.teamdev.filehub.processes.authentication.UserAuthenticationCommand;
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.authentication.UserAuthenticationResponse;
import com.teamdev.filehub.processes.authentication.UserDataMismatchException;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * {@link Route} to handle user authentication path.
 */
public class AuthenticationRoute implements Route {

    Gson gson = new Gson();
    UserAuthenticationProcess process;

    public AuthenticationRoute(UserAuthenticationProcess process) {
        this.process = process;
    }

    /**
     * Parses the {@link UserAuthenticationCommand} from the request body
     * and handle it with the {@link UserAuthenticationProcess}.
     *
     * @param request
     *         HTTP request
     * @param response
     *         HTTP response
     * @return - {@link UserAuthenticationResponse} as JSON
     */
    @Override
    public Object handle(Request request, Response response) {
        try {
            JsonObject requestBody = gson.fromJson(request.body(), JsonObject.class);

            UserAuthenticationCommand command =
                    new UserAuthenticationCommand(
                            requestBody.get("login")
                                       .getAsString(),
                            requestBody.get("password")
                                       .getAsString());

            UserAuthenticationResponse authResponse = process.handle(command);
            response.status(200);
            return gson.toJson(authResponse);

        } catch (UserDataMismatchException e) {
            response.status(401);
            return e.getMessage();
        }
    }
}

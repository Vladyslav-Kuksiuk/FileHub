package com.teamdev.server;

import com.google.gson.Gson;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.register.InvalidEmailException;
import com.teamdev.filehub.processes.register.UserAlreadyRegisteredException;
import com.teamdev.filehub.processes.register.UserRegistrationCommand;
import com.teamdev.filehub.processes.register.UserRegistrationProcess;
import spark.Request;
import spark.Response;
import spark.Route;

import java.util.Map;

/**
 * Route to handle user registration process.
 */
public class RegistrationRoute implements Route {
    private final Gson gson = new Gson();
    private final UserRegistrationProcess process;

    public RegistrationRoute(UserRegistrationProcess process) {
        this.process = process;
    }

    @Override
    public Object handle(Request request, Response response) {
        Map<String, String> responseBodyMap = gson.fromJson(request.body(), Map.class);
        try {
            UserRegistrationCommand command =
                    new UserRegistrationCommand(responseBodyMap.get("login"),
                            responseBodyMap.get("password"));
            RecordId<String> userId = process.handle(command);
            response.status(200);
            return gson.toJson(userId);

        } catch (InvalidEmailException e) {
            FieldErrors errors = new FieldErrors();
            errors.addError(new FieldError("email", e.getMessage()));
            response.status(422);
            return gson.toJson(errors);
        } catch (UserAlreadyRegisteredException e) {
            response.status(409);
            return e.getMessage();
        }
    }
}

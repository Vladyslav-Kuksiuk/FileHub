package com.teamdev.server;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.register.FieldValidationException;
import com.teamdev.filehub.processes.register.UserAlreadyRegisteredException;
import com.teamdev.filehub.processes.register.UserRegistrationCommand;
import com.teamdev.filehub.processes.register.UserRegistrationProcess;
import spark.Request;
import spark.Response;
import spark.Route;

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

        try {
            JsonObject requestBody = gson.fromJson(request.body(), JsonObject.class);

            UserRegistrationCommand command = new UserRegistrationCommand(
                    requestBody.get("login").getAsString(),
                    requestBody.get("password").getAsString());

            RecordId<String> userId = process.handle(command);
            response.status(200);

            return gson.toJson(userId);

        } catch (FieldValidationException exception) {
            FieldErrors errors = new FieldErrors();
            errors.addError(new FieldErrorMessage(exception.getField(), exception.getMessage()));
            response.status(422);

            return gson.toJson(errors);

        } catch (UserAlreadyRegisteredException e) {
            response.status(409);

            return e.getMessage();
        }
    }
}

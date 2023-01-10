package com.teamdev.server;

import com.google.gson.Gson;
import com.teamdev.filehub.processes.register.FieldValidationException;
import com.teamdev.filehub.processes.register.UserAlreadyRegisteredException;
import com.teamdev.filehub.processes.register.UserRegistrationCommand;
import com.teamdev.filehub.processes.register.UserRegistrationProcess;

public class RegistrationRoute extends WrappedRoute {

    private final Gson gson = new Gson();
    private final UserRegistrationProcess userRegistrationProcess;

    public RegistrationRoute(
            UserRegistrationProcess userRegistrationProcess) {
        this.userRegistrationProcess = userRegistrationProcess;
    }

    @Override
    protected void wrappedHandle(WrappedRequest request, WrappedResponse response)
            throws JsonEntityValidationException, UserAlreadyRegisteredException {

        try {
            var jsonBody = request.jsonBody();
            var command = new UserRegistrationCommand(jsonBody.getAsString("login"),
                                                      jsonBody.getAsString("password"));

            var userId = userRegistrationProcess.handle(command);

            response.setBody(userId.value());

        } catch (FieldValidationException exception) {

            FieldErrors errors = new FieldErrors();
            errors.addError(new FieldErrorMessage(exception.getField(), exception.getMessage()));
            response.setStatus(422);

            response.setBody(gson.toJson(errors));

        }

    }
}

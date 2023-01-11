package com.teamdev.server.routes;

import com.google.gson.Gson;
import com.teamdev.filehub.processes.register.FieldValidationException;
import com.teamdev.filehub.processes.register.UserAlreadyRegisteredException;
import com.teamdev.filehub.processes.register.UserRegistrationCommand;
import com.teamdev.filehub.processes.register.UserRegistrationProcess;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.ServiceSupportingRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import java.util.List;
import java.util.Map;

/**
 * An {@link ServiceSupportingRoute} implementation to provide 'user registration' request handling.
 */
public class RegistrationRoute extends ServiceSupportingRoute {

    private final Gson gson = new Gson();
    private final UserRegistrationProcess userRegistrationProcess;

    public RegistrationRoute(
            UserRegistrationProcess userRegistrationProcess) {
        this.userRegistrationProcess = userRegistrationProcess;
    }

    /**
     * Handles 'user registration' request.
     *
     * @param request
     *         The request object providing information about the HTTP request.
     * @param response
     *         The response object providing functionality for modifying the response.
     * @throws JsonEntityValidationException
     *         If JSON body can`t be processed.
     * @throws UserAlreadyRegisteredException
     *         If user with this login is already registered in the system
     */
    @Override
    protected void wrappedRequestHandle(WrappedRequest request, Response response)
            throws JsonEntityValidationException, UserAlreadyRegisteredException {

        try {
            var jsonBody = request.jsonBody();
            var command = new UserRegistrationCommand(jsonBody.getAsString("login"),
                                                      jsonBody.getAsString("password"));

            var userId = userRegistrationProcess.handle(command);

            response.body(userId.value());

        } catch (FieldValidationException exception) {

            response.status(422);

            response.body(gson.toJson(Map.of("errors",
                                             List.of(Map.of("fieldName",
                                                            exception.getField(),
                                                            "errorText",
                                                            exception.getMessage())))));

        }

    }
}

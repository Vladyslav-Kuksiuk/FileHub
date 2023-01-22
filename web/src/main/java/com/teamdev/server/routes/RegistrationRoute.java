package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.RequestFieldValidationException;
import com.teamdev.filehub.processes.user.register.UserAlreadyRegisteredException;
import com.teamdev.filehub.processes.user.register.UserRegistrationCommand;
import com.teamdev.filehub.processes.user.register.UserRegistrationProcess;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * An {@link WrappedRoute} implementation to provide 'user registration' request handling.
 */
public class RegistrationRoute extends WrappedRoute {

    private final Gson gson = new Gson();
    private final UserRegistrationProcess userRegistrationProcess;

    public RegistrationRoute(@Nonnull UserRegistrationProcess userRegistrationProcess) {
        this.userRegistrationProcess = Preconditions.checkNotNull(userRegistrationProcess);
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

        } catch (RequestFieldValidationException exception) {

            String errorJson = gson.toJson(Map.of("errors",
                                                  List.of(new TreeMap<>(Map.of("fieldName",
                                                                               exception.getField(),
                                                                               "errorText",
                                                                               exception.getMessage())))));
            response.status(422);
            response.body(errorJson);

        }

    }
}

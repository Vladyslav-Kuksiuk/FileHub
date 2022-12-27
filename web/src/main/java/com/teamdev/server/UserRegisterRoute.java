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

import java.util.HashMap;
import java.util.Map;

public class UserRegisterRoute implements Route {
    Gson gson = new Gson();
    UserRegistrationProcess process;

    public UserRegisterRoute(UserRegistrationProcess process) {
        this.process = process;
    }

    @Override
    public Object handle(Request request, Response response) {
        Map<String, String> responseBodyMap = gson.fromJson(request.body(), HashMap.class);
        try {
            UserRegistrationCommand command =
                    new UserRegistrationCommand(responseBodyMap.get("login"),
                            responseBodyMap.get("password"),
                            responseBodyMap.get("login"));
            RecordId<String> userId = process.handle(command);
            response.status(200);
            return gson.toJson(userId);

        } catch (UserAlreadyRegisteredException | InvalidEmailException e) {
            ValidationErrors errors = new ValidationErrors();
            errors.addError(new ValidationError("email", e.getMessage()));
            System.out.println(gson.toJson(errors));
            response.status(422);
            return gson.toJson(errors);
        }
    }
}

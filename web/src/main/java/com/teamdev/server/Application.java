package com.teamdev.server;

import com.teamdev.filehub.ServiceLocator;
import com.teamdev.filehub.processes.register.UserRegistrationProcess;
import com.teamdev.filehub.servicelocator.ServiceLocatorImpl;

import static spark.Spark.*;

public class Application {
    public static void main(String[] args) {
        staticFiles.location("/web-client");
        ServiceLocator serviceLocator = new ServiceLocatorImpl();

        get("hello", (req, resp)->"1213");
        post("api/register", new UserRegisterRoute(serviceLocator.locate(UserRegistrationProcess.class)));
    }
}

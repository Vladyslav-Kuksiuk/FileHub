package com.teamdev.server;

import com.teamdev.filehub.ServiceLocator;
import com.teamdev.filehub.processes.register.UserRegistrationProcess;
import com.teamdev.filehub.servicelocator.ServiceLocatorImpl;

import static spark.Spark.post;
import static spark.Spark.staticFiles;

/**
 * Class to configure and start server.
 */
public class Application {
    public static void main(String[] args) {
        staticFiles.location("/web-client");
        ServiceLocator serviceLocator = new ServiceLocatorImpl();

        post("api/register", new RegistrationRoute(serviceLocator.locate(UserRegistrationProcess.class)));
    }
}

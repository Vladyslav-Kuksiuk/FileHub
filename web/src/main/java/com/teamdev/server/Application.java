package com.teamdev.server;

import com.teamdev.filehub.ApplicationContext;

import static spark.Spark.post;
import static spark.Spark.staticFiles;

/**
 * Class to configure and start server.
 */
public class Application {

    public static void main(String[] args) {
        staticFiles.location("/web-client");
        ApplicationContext context = new ApplicationContext();

        post("api/register", new RegistrationRoute(context.getUserRegistrationProcess()));
        post("api/login", new AuthenticationRoute(context.getUserAuthenticationProcess()));
    }
}

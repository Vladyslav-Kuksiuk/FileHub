package com.teamdev.server;

import com.teamdev.filehub.ApplicationContext;
import com.teamdev.server.routes.AuthenticationRoute;
import com.teamdev.server.routes.LoadUserRoute;
import com.teamdev.server.routes.RegistrationRoute;

import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

/**
 * Class to configure and start server.
 */
public class Application {

    private Application() {
    }

    public static void main(String[] args) {
        staticFiles.location("/web-client");
        ApplicationContext context = new ApplicationContext();

        post("api/register", new RegistrationRoute(context.getUserRegistrationProcess()));
        post("api/login", new AuthenticationRoute(context.getUserAuthenticationProcess()));

        get("api/user",
            new LoadUserRoute(context.getUserAuthorizationView(), context.getUserProfileView()));
    }
}

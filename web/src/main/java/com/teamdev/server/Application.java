package com.teamdev.server;

import com.teamdev.filehub.ApplicationConfiguration;
import com.teamdev.server.routes.AuthenticationRoute;
import com.teamdev.server.routes.CreateFolderRoute;
import com.teamdev.server.routes.LoadFolderContentRoute;
import com.teamdev.server.routes.LoadFolderRoute;
import com.teamdev.server.routes.LoadUserRoute;
import com.teamdev.server.routes.LogoutRoute;
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
        ApplicationConfiguration context = new ApplicationConfiguration();

        post("api/register", new RegistrationRoute(context.getUserRegistrationProcess()));
        post("api/login", new AuthenticationRoute(context.getUserAuthenticationProcess()));
        post("api/logout",
             new LogoutRoute(context.getUserAuthorizationView(), context.getUserLogoutProcess()));

        get("api/user",
            new LoadUserRoute(context.getUserAuthorizationView(), context.getUserProfileView()));
        get("api/folders/:id",
            new LoadFolderRoute(context.getUserAuthorizationView(), context.getFolderInfoView()));
        get("api/folders/:id/content",
            new LoadFolderContentRoute(context.getUserAuthorizationView(),
                                       context.getFolderContentView()));

        post("api/folders",
             new CreateFolderRoute(context.getUserAuthorizationView(),
                                   context.getFolderCreateProcess()));
    }
}

package com.teamdev.server;

import com.teamdev.filehub.ApplicationContext;

import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;
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
        post("api/logout",
             new LogoutRoute(context.getUserAuthorizationView(), context.getUserLogoutProcess()));

        get("api/user",
            new LoadUserRoute(context.getUserAuthorizationView(), context.getUserProfileView()));
        get("api/folders/:id",
            new LoadFolderRoute(context.getUserAuthorizationView(), context.getFolderInfoView()));
        get("api/folders/:id/content",
            new LoadFolderContentRoute(context.getUserAuthorizationView(),
                                       context.getFolderContentView()));
        put("api/file/:id",
            new RenameFileRoute(context.getUserAuthorizationView(),
                                context.getFileRenameProcess()));

        get("api/files/:id",
            new DownloadFileRoute(context.getUserAuthorizationView(),
                                  context.getFileDownloadView()));

        post("api/folders",
             new CreateFolderRoute(context.getUserAuthorizationView(),
                                   context.getFolderCreateProcess()));
        post("api/folders/:id/content",
             new UploadFileRoute(context.getUserAuthorizationView(),
                                 context.getFileUploadProcess()));
    }
}

package com.teamdev.server;

import com.teamdev.filehub.ApplicationConfiguration;
import com.teamdev.server.routes.AuthenticationRoute;
import com.teamdev.server.routes.CreateFolderRoute;
import com.teamdev.server.routes.DownloadFileRoute;
import com.teamdev.server.routes.LoadFolderContentRoute;
import com.teamdev.server.routes.LoadFolderRoute;
import com.teamdev.server.routes.LoadUserRoute;
import com.teamdev.server.routes.LogoutRoute;
import com.teamdev.server.routes.RegistrationRoute;
import com.teamdev.server.routes.RemoveItemRoute;
import com.teamdev.server.routes.RenameItemRoute;
import com.teamdev.server.routes.SearchInFolderRoute;
import com.teamdev.server.routes.UploadFileRoute;

import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;
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
        get("api/files/:id",
            new DownloadFileRoute(context.getUserAuthorizationView(),
                                  context.getFileDownloadView()));
        get("api/folders/:id/search/:searchWord",
            new SearchInFolderRoute(context.getUserAuthorizationView(),
                                    context.getFolderSearchView()));

        put("api/file/:id",
            new RenameItemRoute(context.getUserAuthorizationView(),
                                context.getFileRenameProcess()));
        put("api/folder/:id",
            new RenameItemRoute(context.getUserAuthorizationView(),
                                context.getFolderRenameProcess()));

        delete("api/file/:id",
               new RemoveItemRoute(context.getUserAuthorizationView(),
                                   context.getFileRemoveProcess()));
        delete("api/folder/:id",
               new RemoveItemRoute(context.getUserAuthorizationView(),
                                   context.getFolderRemoveProcess()));

        post("api/folders",
             new CreateFolderRoute(context.getUserAuthorizationView(),
                                   context.getFolderCreateProcess()));
        post("api/folders/:id/content",
             new UploadFileRoute(context.getUserAuthorizationView(),
                                 context.getFileUploadProcess()));
    }
}

package com.teamdev.server;

import com.teamdev.filehub.ServicesConfiguration;
import com.teamdev.server.routes.*;

import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;
import static spark.Spark.staticFiles;

/**
 * Provides REST API to communicate with services via HTTP requests.
 */
public class RESTServer {

    private RESTServer() {
    }

    /**
     * Binds {@link spark.Route} implementations on HTTP requests
     * and starts server.
     */
    public static void main(String[] args) {
        staticFiles.location("/web-client");
        ServicesConfiguration context = new ServicesConfiguration();

        post("api/register", new RegistrationRoute(context.getUserRegistrationProcess()));
        post("api/send-confirmation-email", new SendConfirmationEmailRoute(context.getSendEmailConfirmationProcess()));
        post("api/confirm-email/:confirmationToken", new ConfirmEmailRoute(context.getEmailConfirmationProcess()));
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

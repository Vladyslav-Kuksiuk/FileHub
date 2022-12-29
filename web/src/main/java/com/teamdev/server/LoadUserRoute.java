package com.teamdev.server;

import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import spark.Request;
import spark.Response;

public class LoadUserRoute extends AuthorizedRoute {
    public LoadUserRoute(UserAuthorizationView authorizationView) {
        super(authorizationView);
    }

    @Override
    public Object authorizedHandle(Request request, Response response) {
        return "{\"username\": \"User\", \"rootFolderId\": \"rootId\"}";
    }
}

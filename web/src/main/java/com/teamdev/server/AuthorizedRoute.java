package com.teamdev.server;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UnauthorizedUserException;
import com.teamdev.filehub.views.authorization.UserAuthorizationQuery;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import spark.Request;
import spark.Response;
import spark.Route;

public abstract class AuthorizedRoute implements Route {

    private final UserAuthorizationView authorizationView;

    public AuthorizedRoute(UserAuthorizationView authorizationView) {
        this.authorizationView = authorizationView;
    }

    @Override
    public Object handle(Request request, Response response) {
        String authorizationHeader = request.headers("Authorization");
        System.out.println("header: " + authorizationHeader);
        String token = authorizationHeader.split(" ")[1];
        System.out.println("token: " + token);

        try {
            RecordId<String> userId = authorizationView.handle(new UserAuthorizationQuery(token));
            return authorizedHandle(request, response, userId);
        } catch (UnauthorizedUserException e) {
            response.status(401);
            return e.getMessage();
        }
    }

    public abstract Object authorizedHandle(Request request, Response response, RecordId<String> userId);
}

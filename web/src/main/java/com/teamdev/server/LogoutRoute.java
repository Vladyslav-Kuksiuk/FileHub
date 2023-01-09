package com.teamdev.server;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.user.logout.UserLogoutCommand;
import com.teamdev.filehub.processes.user.logout.UserLogoutProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import spark.Request;
import spark.Response;

public class LogoutRoute extends AuthorizedRoute {

    private final UserLogoutProcess userLogoutProcess;

    public LogoutRoute(UserAuthorizationView authorizationView,
                       UserLogoutProcess userLogoutProcess) {
        super(authorizationView);
        this.userLogoutProcess = userLogoutProcess;
    }

    @Override
    protected Object authorizedHandle(Request request, Response response, RecordId<String> userId) {
        UserLogoutCommand command = new UserLogoutCommand(userId);
        return userLogoutProcess.handle(command)
                                .value();
    }
}

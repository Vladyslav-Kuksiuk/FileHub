package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.processes.user.confirmation.email.confirm.EmailConfirmationCommand;
import com.teamdev.filehub.processes.user.confirmation.email.confirm.EmailConfirmationProcess;
import com.teamdev.server.WrappedRequest;
import com.teamdev.server.WrappedRoute;
import spark.Response;

import javax.annotation.Nonnull;

public class ConfirmEmailRoute extends WrappedRoute {

    private final EmailConfirmationProcess emailConfirmationProcess;

    public ConfirmEmailRoute(@Nonnull EmailConfirmationProcess emailConfirmationProcess) {
        this.emailConfirmationProcess = Preconditions.checkNotNull(emailConfirmationProcess);
    }

    @Override
    protected void wrappedRequestHandle(WrappedRequest request, Response response) throws ServiceException {
        var command = new EmailConfirmationCommand(request.params(":confirmationToken"));
        var userId = emailConfirmationProcess.handle(command);

        response.body(userId.value());
    }
}

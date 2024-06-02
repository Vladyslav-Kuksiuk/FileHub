package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.ServiceException;
import com.teamdev.filehub.processes.user.confirmation.email.send.SendEmailConfirmationCommand;
import com.teamdev.filehub.processes.user.confirmation.email.send.SendEmailConfirmationProcess;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import com.teamdev.server.WrappedRoute;
import spark.Response;

import javax.annotation.Nonnull;

public class SendConfirmationEmailRoute extends WrappedRoute {

    private final Gson gson = new Gson();
    private final SendEmailConfirmationProcess sendEmailConfirmationProcess;

    public SendConfirmationEmailRoute(@Nonnull SendEmailConfirmationProcess sendEmailConfirmationProcess) {
        this.sendEmailConfirmationProcess = Preconditions.checkNotNull(sendEmailConfirmationProcess);
    }

    @Override
    protected void wrappedRequestHandle(WrappedRequest request, Response response)
            throws ServiceException, JsonEntityValidationException {
        var jsonBody = request.jsonBody();
        var command = new SendEmailConfirmationCommand(jsonBody.getAsString("email"));
        var userId = sendEmailConfirmationProcess.handle(command);

        response.body(userId.value());
    }
}

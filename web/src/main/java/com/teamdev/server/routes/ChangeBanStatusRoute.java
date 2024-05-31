package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.admin.ban.ChangeBanStatusCommand;
import com.teamdev.filehub.processes.admin.ban.ChangeBanStatusProcess;
import com.teamdev.filehub.views.admin.userstatistics.UserStatistic;
import com.teamdev.filehub.views.admin.userstatistics.UserStatisticsQuery;
import com.teamdev.filehub.views.admin.userstatistics.UserStatisticsView;
import com.teamdev.filehub.views.authorization.admin.AdminAuthorizationView;
import com.teamdev.server.AuthorizedAdminRoute;
import com.teamdev.server.JsonEntityValidationException;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedAdminRoute} implementation to provide 'load files statistics' request handling.
 */
public class ChangeBanStatusRoute extends AuthorizedAdminRoute {

    private final ChangeBanStatusProcess changeBanStatusProcess;
    private final Gson gson = new Gson();
    private final boolean banStatus;

    public ChangeBanStatusRoute(
            @Nonnull AdminAuthorizationView authorizationView,
            @Nonnull ChangeBanStatusProcess changeBanStatusProcess,
            boolean banStatus) {

        super(Preconditions.checkNotNull(authorizationView));
        this.changeBanStatusProcess = Preconditions.checkNotNull(changeBanStatusProcess);
        this.banStatus = banStatus;
    }

    /**
     * Handles 'change user ban status' request.
     *
     * @param request  The request object providing information about the HTTP request.
     * @param response The response object providing functionality for modifying the response.
     * @param userId   Authorized user id.
     */
    @Override
    protected void authorizedHandle(WrappedRequest request, Response response,
                                    RecordId userId)
            throws DataNotFoundException, AccessDeniedException, JsonEntityValidationException {
        var jsonBody = request.jsonBody();

        ChangeBanStatusCommand command = new ChangeBanStatusCommand(userId, jsonBody.getAsString("email"), banStatus);

        changeBanStatusProcess.handle(command);
    }
}

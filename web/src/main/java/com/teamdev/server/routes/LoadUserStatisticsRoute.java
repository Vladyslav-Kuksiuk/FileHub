package com.teamdev.server.routes;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.admin.userstatistics.UserStatistic;
import com.teamdev.filehub.views.admin.userstatistics.UserStatisticsQuery;
import com.teamdev.filehub.views.admin.userstatistics.UserStatisticsView;
import com.teamdev.filehub.views.authorization.admin.AdminAuthorizationView;
import com.teamdev.server.AuthorizedAdminRoute;
import com.teamdev.server.WrappedRequest;
import spark.Response;

import javax.annotation.Nonnull;

/**
 * An {@link AuthorizedAdminRoute} implementation to provide 'load files statistics' request handling.
 */
public class LoadUserStatisticsRoute extends AuthorizedAdminRoute {

    private final UserStatisticsView userStatisticsView;
    private final Gson gson = new Gson();

    public LoadUserStatisticsRoute(
            @Nonnull AdminAuthorizationView authorizationView,
            @Nonnull UserStatisticsView userStatisticsView) {
        super(Preconditions.checkNotNull(authorizationView));
        this.userStatisticsView = Preconditions.checkNotNull(userStatisticsView);
    }

    /**
     * Handles 'load files statistics' request.
     *
     * @param request  The request object providing information about the HTTP request.
     * @param response The response object providing functionality for modifying the response.
     * @param userId   Authorized user id.
     */
    @Override
    protected void authorizedHandle(WrappedRequest request, Response response,
                                    RecordId userId)
            throws DataNotFoundException, AccessDeniedException {

        UserStatisticsQuery query = new UserStatisticsQuery(userId, request.params(":email"));

        UserStatistic statistics = userStatisticsView.handle(query);

        response.body(gson.toJson(statistics));
    }
}

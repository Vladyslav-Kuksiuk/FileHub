package com.teamdev.filehub.views.authorization.admin;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;

import static com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationProcessImpl.ADMIN_TOKEN;

/**
 * {@link AdminAuthorizationView} implementation.
 */
public class AdminAuthorizationViewImpl implements AdminAuthorizationView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();


    @Override
    public RecordId handle(AdminAuthorizationQuery query) throws UserAuthorizationException {

        logger.atInfo()
                .log("[VIEW QUERIED] - Admin authorization - token: %s.", query.authorizationToken());

        if (query.authorizationToken().equals(ADMIN_TOKEN)) {
            logger.atInfo()
                    .log("[VIEW FINISHED] - Admin authorization.");
        }

        return new RecordId("admin");
    }
}

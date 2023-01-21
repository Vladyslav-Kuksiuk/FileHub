package com.teamdev.filehub.views.authorization;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.AuthenticationRecord;
import com.teamdev.util.LocalDateTimeUtil;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * {@link UserAuthorizationView} implementation.
 */
public class UserAuthorizationViewImpl implements UserAuthorizationView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final AuthenticationDao authenticationDao;

    public UserAuthorizationViewImpl(AuthenticationDao authenticationDao) {
        this.authenticationDao = Preconditions.checkNotNull(authenticationDao);
    }

    @Override
    public RecordId handle(UserAuthorizationQuery query) throws UserAuthorizationException {

        logger.atInfo()
              .log("[VIEW QUERIED] - User authorization - token: %s.", query.authorizationToken());

        Optional<AuthenticationRecord> optionalAuthRecord = authenticationDao.findByToken(
                query.authorizationToken());

        if (optionalAuthRecord.isEmpty()) {

            logger.atInfo()
                  .log("[VIEW FAILED] - User authorization - Token not found - token: %s.",
                       query.authorizationToken());

            throw new UserAuthorizationException("Authorization token not found");
        }

        AuthenticationRecord authRecord = optionalAuthRecord.get();
        LocalDateTime authorizationTime = LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE);

        if (authorizationTime.isAfter(authRecord.expireTime())) {

            logger.atInfo()
                  .log("[VIEW FAILED] - User authorization - Token expired - token: %s.",
                       query.authorizationToken());

            throw new UserAuthorizationException("Authorization token expired");
        }

        logger.atInfo()
              .log("[VIEW FINISHED] - User authorization - userId: %s.", authRecord.userId()
                                                                                   .value());

        return authRecord.userId();
    }
}

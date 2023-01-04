package com.teamdev.filehub.views.authorization;

import com.google.common.base.Preconditions;
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

    private final AuthenticationDao authenticationDao;

    public UserAuthorizationViewImpl(AuthenticationDao authenticationDao) {
        this.authenticationDao = Preconditions.checkNotNull(authenticationDao);
    }

    @Override
    public RecordId<String> handle(UserAuthorizationQuery query) throws UnauthorizedUserException {

        Optional<AuthenticationRecord> optionalAuthRecord = authenticationDao.findByToken(
                query.authorizationToken());

        if (optionalAuthRecord.isEmpty()) {
            throw new UnauthorizedUserException("Authorization token not found");
        }

        AuthenticationRecord authRecord = optionalAuthRecord.get();
        LocalDateTime authorizationTime = LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE);

        if (authorizationTime.isAfter(authRecord.expireTime())) {
            throw new UnauthorizedUserException("Authorization token expired");
        }

        return authRecord.id();
    }
}

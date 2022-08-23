package com.teamdev.services.authentication;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.persistent.dao.authentication.AuthenticationRecord;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.services.ApplicationProcess;
import com.teamdev.util.LocalDateTimeUtil;
import com.teamdev.util.StringEncryptor;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;

/**
 * A {@link UserAuthenticationProcess} implementation.
 */
public class UserAuthenticationProcessImpl implements UserAuthenticationProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();
    private final UserDao userDao;
    private final AuthenticationDao authenticationDao;

    public UserAuthenticationProcessImpl(UserDao userDao,
                                         AuthenticationDao authenticationDao) {
        this.userDao = Preconditions.checkNotNull(userDao);
        this.authenticationDao = Preconditions.checkNotNull(authenticationDao);
    }

    /**
     * A {@link ApplicationProcess} implementation which is intended to process
     * user authentication.
     */
    @Override
    public UserAuthenticationResponse run(@Nonnull UserAuthenticationCommand command) throws
                                                                                      DataAccessException {

        logger.atInfo()
              .log("[PROCESS STARTED] - User authentication - login: %s", command.getLogin());

        UserRecord userRecord = userDao.findByLogin(command.getLogin());

        boolean isPasswordMatch = StringEncryptor.encrypt(command.getPassword())
                                                 .equals(userRecord.password());

        if (!isPasswordMatch) {
            throw new DataAccessException("Password incorrect.");
        }

        LocalDateTime authenticationTime = LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE);
        LocalDateTime expireDateTime = authenticationTime.plusDays(1);

        String authenticationToken = StringEncryptor.encrypt(
                userRecord.login() + expireDateTime);

        AuthenticationRecord authenticationRecord =
                new AuthenticationRecord(userRecord.getId(),
                                         authenticationToken,
                                         expireDateTime);

        authenticationDao.create(authenticationRecord);

        UserAuthenticationResponse response =
                new UserAuthenticationResponse(userRecord.getId(),
                                               authenticationToken);

        return response;
    }
}

package com.teamdev.filehub.processes.authentication;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.DataAccessException;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.AuthenticationRecord;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.dao.user.UserRecord;
import com.teamdev.filehub.processes.ApplicationProcess;
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
    public UserAuthenticationResponse handle(@Nonnull UserAuthenticationCommand command) throws
                                                                                         UserDataMismatchException {

        logger.atInfo()
              .log("[PROCESS STARTED] - User authentication - login: %s.", command.login());

        UserRecord userRecord = null;
        try {
            userRecord = userDao.findByLogin(command.login());
        } catch (DataAccessException exception) {
            throw new UserDataMismatchException(exception.getMessage());
        }

        boolean isPasswordMatch = StringEncryptor.encrypt(command.password())
                                                 .equals(userRecord.password());

        if (!isPasswordMatch) {

            logger.atWarning()
                  .log("[PROCESS FAILED] - User authentication - login: %s - Exception message: Password incorrect.",
                       command.login());

            throw new UserDataMismatchException("Password incorrect.");
        }

        LocalDateTime authenticationTime = LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE);
        LocalDateTime expireDateTime = authenticationTime.plusDays(1);

        String authenticationToken = StringEncryptor.encrypt(
                userRecord.login() + expireDateTime);

        AuthenticationRecord authenticationRecord =
                new AuthenticationRecord(userRecord.id(),
                                         authenticationToken,
                                         expireDateTime);

        try {
            authenticationDao.create(authenticationRecord);
        } catch (DataAccessException exception) {

            logger.atWarning()
                  .log("[PROCESS FAILED] - User authentication - login: %s - Exception message: %s.",
                       command.login(), exception.getMessage());

            throw new UserDataMismatchException(exception.getMessage());
        }

        UserAuthenticationResponse response =
                new UserAuthenticationResponse(authenticationToken);

        logger.atInfo()
              .log("[PROCESS FINISHED] - User authentication - login: %s.", command.login());

        return response;
    }
}

package com.teamdev.services.authentication;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.persistent.dao.authentication.AuthenticationRecord;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.services.ApplicationProcess;
import com.teamdev.util.StringEncryptor;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * A {@link ApplicationProcess} implementation which is intended to process
 * user authentication.
 */
public class UserAuthenticationProcess implements ApplicationProcess<UserAuthenticationCommand, UserAuthenticationResponse> {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();
    private final UserDao userDao;
    private final AuthenticationDao authenticationDao;

    public UserAuthenticationProcess(UserDao userDao,
                                     AuthenticationDao authenticationDao) {
        this.userDao = Preconditions.checkNotNull(userDao);
        this.authenticationDao = Preconditions.checkNotNull(authenticationDao);
    }

    /**
     * A {@link ApplicationProcess} implementation which is intended to process
     * user authorization.
     */
    @Override
    public UserAuthenticationResponse run(@NotNull UserAuthenticationCommand command) throws
                                                                                      DataAccessException {

        logger.atInfo()
              .log("[PROCESS STARTED] - User authorization - login: %s", command.getLogin());

        UserRecord userRecord = userDao.findByLogin(command.getLogin());

        boolean isPasswordMatch = StringEncryptor.encrypt(command.getPassword())
                                                 .equals(userRecord.password());

        if (!isPasswordMatch) {
            throw new DataAccessException("Password incorrect.");
        }

        Date authorizationTime = new Date();
        String authenticationToken = StringEncryptor.encrypt(
                userRecord.login() + authorizationTime);

        AuthenticationRecord authenticationRecord =
                new AuthenticationRecord(userRecord.getId(),
                                         authenticationToken,
                                         authorizationTime);

        authenticationDao.create(authenticationRecord);

        UserAuthenticationResponse response =
                new UserAuthenticationResponse(userRecord.getId(),
                                               authenticationToken);

        return response;
    }
}

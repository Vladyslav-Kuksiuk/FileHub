package com.teamdev.services.authentication;

import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.user.AuthenticationRecord;
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

    public UserAuthenticationProcess(@NotNull UserDao userDao) {
        this.userDao = userDao;
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
                new AuthenticationRecord(new RecordIdentifier<>(userRecord.login()),
                                         userRecord.getId(),
                                         authenticationToken,
                                         authorizationTime);

        userDao.authenticate(authenticationRecord);

        UserAuthenticationResponse response =
                new UserAuthenticationResponse(userRecord.getId(),
                                               authenticationToken);

        return response;
    }
}

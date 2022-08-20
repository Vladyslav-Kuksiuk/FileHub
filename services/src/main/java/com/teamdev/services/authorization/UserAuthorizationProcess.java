package com.teamdev.services.authorization;

import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.user.AuthorizationRecord;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.services.ApplicationProcess;
import com.teamdev.util.StringEncryptor;

import javax.validation.constraints.NotNull;
import java.util.Date;

public class UserAuthorizationProcess implements ApplicationProcess<UserAuthorizationCommand, UserAuthorizationResponse> {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();
    private final UserDao userDao;

    public UserAuthorizationProcess(@NotNull UserDao userDao) {
        this.userDao = userDao;
    }

    /**
     * A {@link ApplicationProcess} implementation which is intended to process
     * user authorization.
     */
    @Override
    public UserAuthorizationResponse run(@NotNull UserAuthorizationCommand command) throws
                                                                                    DataAccessException {

        logger.atInfo()
              .log("[PROCESS STARTED] - User authorization - login: %s", command.getLogin());

        UserRecord userRecord = userDao.findByLogin(command.getLogin());

        boolean isPasswordMatch = StringEncryptor.encrypt(command.getPassword())
                                                 .equals(userRecord.getPassword());

        if (!isPasswordMatch) {
            throw new DataAccessException("Password incorrect.");
        }

        Date authorizationTime = new Date();
        String authenticationToken = StringEncryptor.encrypt(
                userRecord.getLogin() + authorizationTime);

        AuthorizationRecord authorizationRecord =
                new AuthorizationRecord(new RecordIdentifier<>(userRecord.getLogin()),
                                        userRecord.getId(),
                                        authenticationToken,
                                        authorizationTime);

        userDao.authorize(authorizationRecord);

        UserAuthorizationResponse response =
                new UserAuthorizationResponse(userRecord.getId(),
                                              authenticationToken);

        return response;
    }
}

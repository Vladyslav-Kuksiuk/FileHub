package com.teamdev.filehub.processes.user.confirmation.email.confirm;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.dao.user.UserRecord;

import javax.annotation.Nonnull;
import javax.annotation.ParametersAreNonnullByDefault;

public class EmailConfirmationProcessImpl implements EmailConfirmationProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;

    @ParametersAreNonnullByDefault
    public EmailConfirmationProcessImpl(@Nonnull UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public RecordId handle(EmailConfirmationCommand command) throws DataNotFoundException {
        logger.atInfo()
                .log("[PROCESS STARTED] - Email confirmation");

        var oUser = userDao.findByEmailHash(command.emailConfirmationToken());

        if (oUser.isEmpty()) {
            logger.atInfo()
                    .log("[PROCESS FAILED] - Email confirmation");
            throw new DataNotFoundException("Email confirmation token is invalid.");
        }
        var user = oUser.get();

        userDao.update(new UserRecord(
                user.id(),
                user.login(),
                user.password(),
                true,
                user.emailHash()
        ));

        logger.atInfo()
                .log("[PROCESS FINISHED] - Email confirmation");

        return user.id();
    }
}

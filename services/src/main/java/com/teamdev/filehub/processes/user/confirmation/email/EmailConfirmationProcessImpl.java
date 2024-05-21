package com.teamdev.filehub.processes.user.confirmation.email;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.user.UserDao;

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

        var user = userDao.findByEmailHash(command.emailConfirmationToken());

        if (user.isEmpty()) {
            logger.atInfo()
                    .log("[PROCESS FAILED] - Email confirmation");
            throw new DataNotFoundException("Email confirmation token is invalid.");
        }

        return user.get().id();
    }
}

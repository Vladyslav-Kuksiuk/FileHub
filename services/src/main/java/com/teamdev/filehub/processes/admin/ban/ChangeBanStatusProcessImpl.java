package com.teamdev.filehub.processes.admin.ban;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.dao.user.UserRecord;
import com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationCommand;
import com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationProcess;
import com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationResponse;
import com.teamdev.filehub.processes.user.authentication.UserCredentialsMismatchException;

import javax.annotation.Nonnull;

/**
 * A {@link AdminAuthenticationProcess} implementation.
 */
public class ChangeBanStatusProcessImpl implements ChangeBanStatusProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;

    public ChangeBanStatusProcessImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public Boolean handle(@Nonnull ChangeBanStatusCommand command)
            throws DataNotFoundException {
        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - Change ban status - email: %s.", command.targetUserEmail());

        var optUser = userDao.findByLogin(command.targetUserEmail());

        if (optUser.isEmpty()) {

            logger.atWarning()
                  .log("[PROCESS FAILED] - Change ban status - User not found - email: %s.",
                       command.targetUserEmail());

            throw new DataNotFoundException("User not found.");
        }

        var user = optUser.get();

        userDao.update(new UserRecord(
                user.id(),
                user.login(),
                user.password(),
                user.isEmailConfirmed(),
                user.emailHash(),
                command.banStatus()
        ));

        logger.atInfo()
              .log("[PROCESS FINISHED] - Change ban status - email: %s.", command.targetUserEmail());

        return true;
    }
}

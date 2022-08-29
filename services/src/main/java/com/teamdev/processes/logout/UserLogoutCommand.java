package com.teamdev.processes.logout;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about user logout.
 */
public class UserLogoutCommand extends AuthenticatedUserCommand {

    protected UserLogoutCommand(
            @Nonnull RecordIdentifier<String> userId) {
        super(Preconditions.checkNotNull(userId));
    }
}

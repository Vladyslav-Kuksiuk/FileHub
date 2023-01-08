package com.teamdev.filehub.processes.logout;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about user logout.
 */
public class UserLogoutCommand extends AuthenticatedUserCommand {

    public UserLogoutCommand(
            @Nonnull RecordId<String> userId) {
        super(Preconditions.checkNotNull(userId));
    }
}

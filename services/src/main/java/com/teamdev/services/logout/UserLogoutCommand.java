package com.teamdev.services.logout;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.services.CommandWithAuthorizationData;

import javax.validation.constraints.NotNull;

/**
 * A {@link CommandWithAuthorizationData} implementation which is intended to store
 * data about user logout.
 */
public class UserLogoutCommand extends CommandWithAuthorizationData {

    protected UserLogoutCommand(
            @NotNull RecordIdentifier<String> userId,
            @NotNull String authenticationToken) {
        super(Preconditions.checkNotNull(userId),
              Preconditions.checkNotNull(authenticationToken));
    }
}

package com.teamdev.processes.logout;

import com.teamdev.persistent.dao.RecordId;
import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle user logout.
 */
public interface UserLogoutProcess extends ApplicationProcess<UserLogoutCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(UserLogoutCommand command) throws UserNotAuthenticatedException;
}

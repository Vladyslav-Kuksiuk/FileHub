package com.teamdev.filehub.processes.logout;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle user logout.
 */
public interface UserLogoutProcess extends ApplicationProcess<UserLogoutCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(UserLogoutCommand command) throws UserNotAuthenticatedException;
}

package com.teamdev.processes.logout;

import com.teamdev.persistent.dao.RecordId;
import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} extended abstract class
 * which implementation is intended to process user logout.
 */
public interface UserLogoutProcess extends ApplicationProcess<UserLogoutCommand, RecordId<String>> {

    @Override
    RecordId<String> run(UserLogoutCommand command) throws UserNotAuthenticatedException;
}

package com.teamdev.filehub.processes.user.logout;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle user logout.
 */
public interface UserLogoutProcess extends ApplicationProcess<UserLogoutCommand, RecordId> {

    @Override
    RecordId handle(UserLogoutCommand command);
}

package com.teamdev.filehub.processes.user.logout;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * An {@link ApplicationProcess} to provide user's logout.
 */
public interface UserLogoutProcess extends ApplicationProcess<UserLogoutCommand, RecordId> {

    @Override
    RecordId handle(UserLogoutCommand command);
}

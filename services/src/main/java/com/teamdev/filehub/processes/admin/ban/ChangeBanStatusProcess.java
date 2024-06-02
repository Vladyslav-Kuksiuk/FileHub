package com.teamdev.filehub.processes.admin.ban;

import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationCommand;
import com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationResponse;
import com.teamdev.filehub.processes.user.authentication.UserCredentialsMismatchException;

/**
 * An {@link ApplicationProcess} to provide admin authentication.
 */
public interface ChangeBanStatusProcess extends ApplicationProcess<ChangeBanStatusCommand, Boolean> {

    @Override
    Boolean handle(ChangeBanStatusCommand command) throws DataNotFoundException;
}

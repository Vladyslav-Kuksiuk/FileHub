package com.teamdev.filehub.processes.admin.authentication;

import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.user.authentication.UserCredentialsMismatchException;

/**
 * An {@link ApplicationProcess} to provide admin authentication.
 */
public interface AdminAuthenticationProcess extends ApplicationProcess<AdminAuthenticationCommand, AdminAuthenticationResponse> {

    @Override
    AdminAuthenticationResponse handle(AdminAuthenticationCommand command)
            throws UserCredentialsMismatchException;
}

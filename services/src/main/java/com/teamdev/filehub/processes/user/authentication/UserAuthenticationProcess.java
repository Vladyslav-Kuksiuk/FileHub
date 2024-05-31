package com.teamdev.filehub.processes.user.authentication;

import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * An {@link ApplicationProcess} to provide user's authentication.
 */
public interface UserAuthenticationProcess extends ApplicationProcess<UserAuthenticationCommand, UserAuthenticationResponse> {

    @Override
    UserAuthenticationResponse handle(UserAuthenticationCommand command) throws
                                                                         UserCredentialsMismatchException,
                                                                         UserEmailNotConfirmedException,
            UserBannedException;
}

package com.teamdev.processes.authentication;

import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle user authentication.
 */
public interface UserAuthenticationProcess extends ApplicationProcess<UserAuthenticationCommand, UserAuthenticationResponse> {

    @Override
    UserAuthenticationResponse handle(UserAuthenticationCommand command) throws
                                                                         UserDataMismatchException;
}

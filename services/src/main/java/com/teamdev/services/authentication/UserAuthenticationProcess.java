package com.teamdev.services.authentication;

import com.teamdev.services.ApplicationProcess;

/**
 * A {@link ApplicationProcess} extended interface which implementation is intended to process
 * user authentication.
 */
public interface UserAuthenticationProcess extends ApplicationProcess<UserAuthenticationCommand, UserAuthenticationResponse> {

}

package com.teamdev.services.register;

import com.teamdev.services.ApplicationProcess;

/**
 * A {@link ApplicationProcess} extended interface which implementation is intended to process
 * user registration.
 */
public interface UserRegistrationProcess extends ApplicationProcess<UserRegistrationCommand, UserRegistrationResponse> {

}

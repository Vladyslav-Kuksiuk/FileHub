package com.teamdev.processes.register;

import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} extended interface which implementation is intended to process
 * user registration.
 */
public interface UserRegistrationProcess extends ApplicationProcess<UserRegistrationCommand, UserRegistrationResponse> {

}

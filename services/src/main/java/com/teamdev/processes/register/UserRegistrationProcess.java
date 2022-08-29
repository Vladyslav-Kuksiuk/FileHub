package com.teamdev.processes.register;

import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} extended interface which implementation is intended to process
 * user registration.
 */
public interface UserRegistrationProcess extends ApplicationProcess<UserRegistrationCommand, RecordIdentifier<String>> {

    @Override
    RecordIdentifier<String> run(UserRegistrationCommand command) throws
                                                                  UserAlreadyRegisteredException;
}

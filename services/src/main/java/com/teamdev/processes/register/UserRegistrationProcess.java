package com.teamdev.processes.register;

import com.teamdev.persistent.dao.RecordId;
import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle user registration.
 */
public interface UserRegistrationProcess extends ApplicationProcess<UserRegistrationCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(UserRegistrationCommand command) throws
                                                             UserAlreadyRegisteredException;
}

package com.teamdev.filehub.processes.user.register;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle user registration.
 */
public interface UserRegistrationProcess extends ApplicationProcess<UserRegistrationCommand, RecordId> {

    @Override
    RecordId handle(UserRegistrationCommand command) throws UserAlreadyRegisteredException;
}

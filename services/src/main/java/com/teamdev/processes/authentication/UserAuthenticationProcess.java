package com.teamdev.processes.authentication;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} extended interface which implementation is intended to process
 * user authentication.
 */
public interface UserAuthenticationProcess extends ApplicationProcess<UserAuthenticationCommand, UserAuthenticationResponse> {

    @Override
    UserAuthenticationResponse run(UserAuthenticationCommand command) throws DataAccessException;
}

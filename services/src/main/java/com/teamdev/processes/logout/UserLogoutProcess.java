package com.teamdev.processes.logout;

import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.processes.ApplicationProcessWithAuthorization;

import javax.annotation.Nonnull;

/**
 * A {@link ApplicationProcessWithAuthorization} extended abstract class
 * which implementation is intended to process user logout.
 */
public abstract class UserLogoutProcess extends ApplicationProcessWithAuthorization<UserLogoutCommand, UserLogoutResponse> {

    protected UserLogoutProcess(@Nonnull
                                        AuthenticationDao authenticationDao) {
        super(authenticationDao);
    }

}

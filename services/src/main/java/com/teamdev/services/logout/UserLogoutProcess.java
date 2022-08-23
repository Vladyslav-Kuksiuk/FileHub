package com.teamdev.services.logout;

import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.services.ApplicationProcessWithAuthorization;

/**
 * A {@link ApplicationProcessWithAuthorization} extended abstract class
 * which implementation is intended to process user logout.
 */
public abstract class UserLogoutProcess extends ApplicationProcessWithAuthorization<UserLogoutCommand, UserLogoutResponse> {

    protected UserLogoutProcess(
            AuthenticationDao authenticationDao) {
        super(authenticationDao);
    }

}

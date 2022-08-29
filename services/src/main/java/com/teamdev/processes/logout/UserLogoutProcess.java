package com.teamdev.processes.logout;

import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} extended abstract class
 * which implementation is intended to process user logout.
 */
public interface UserLogoutProcess extends ApplicationProcess<UserLogoutCommand, UserLogoutResponse> {

}

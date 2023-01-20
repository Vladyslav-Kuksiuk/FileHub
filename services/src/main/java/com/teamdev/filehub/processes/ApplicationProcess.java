package com.teamdev.filehub.processes;

import com.teamdev.filehub.ServiceException;

import javax.validation.constraints.NotNull;

/**
 * Interface whose implementations handle user {@link Command}.
 * You should implement it if you want to write a service that
 * will change system state at the request of the user.
 *
 * @param <C>
 *         {@link Command} implementation.
 * @param <R>
 *         Server response.
 */
public interface ApplicationProcess<C extends Command, R> {

    /**
     * Handles the user {@link Command}.
     *
     * @param command
     *         {@link Command} to handle.
     * @return Server's command handling result.
     * @throws ServiceException
     *         If {@link Command} can't be handled.
     */
    R handle(@NotNull C command) throws ServiceException;

}

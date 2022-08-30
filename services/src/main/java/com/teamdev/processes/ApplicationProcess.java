package com.teamdev.processes;

import javax.validation.constraints.NotNull;

/**
 * A class for handling actor {@link Command} with application state changes.
 *
 * @param <C>
 *         {@link Command} implementation.
 * @param <R>
 *         Server response.
 */
public interface ApplicationProcess<C extends Command, R> {

    /**
     * Handles the command.
     *
     * @param command
     *         {@link Command} to handle.
     * @return Server's command handling result.
     * @throws ProcessException
     *         If {@link Command} can't be handled.
     */
    R handle(@NotNull C command) throws ProcessException;

}

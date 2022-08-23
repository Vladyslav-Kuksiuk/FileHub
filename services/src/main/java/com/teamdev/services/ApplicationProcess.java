package com.teamdev.services;

import com.teamdev.persistent.dao.DataAccessException;

import javax.validation.constraints.NotNull;

/**
 * A Service Interface which is intended to process commands.
 *
 * @param <C>
 *         {@link Command}.
 */
public interface ApplicationProcess<C extends Command, R extends ServerResponse> {

    /**
     * Method which process {@link Command} and communicate
     * with persistent layer of application.
     *
     * @param command
     *         {@link Command} to process.
     * @return {@link ServerResponse}.
     * @throws DataAccessException
     *         If the database query fails.
     */
    R run(@NotNull C command) throws DataAccessException;

}

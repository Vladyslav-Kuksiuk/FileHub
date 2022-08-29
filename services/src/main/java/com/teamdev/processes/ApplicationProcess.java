package com.teamdev.processes;

import com.teamdev.persistent.dao.DataAccessException;

import javax.validation.constraints.NotNull;

/**
 * A Service Interface which is intended to process commands.
 * Commands processing causes changes in the database.
 *
 * @param <C>
 *         {@link Command} implementation.
 * @param <R>
 *         Server response.
 */
public interface ApplicationProcess<C extends Command, R> {

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

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

    R run(@NotNull C command) throws DataAccessException;

}

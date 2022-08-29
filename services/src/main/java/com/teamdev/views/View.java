package com.teamdev.views;

import com.teamdev.ServerResponse;
import com.teamdev.persistent.dao.DataAccessException;

/**
 * A Service Interface which is intended to process {@link Query}.
 * {@link Query} processing doesn't cause changes in the database.
 *
 * @param <Q>
 *         {@link Query} implementation.
 * @param <R>
 *         {@link ServerResponse} implementation
 */
public interface View<Q extends Query, R extends ServerResponse> {

    /**
     * Method which process {@link Query} and communicate
     * with persistent layer of application.
     *
     * @param query
     *         {@link Query} implementation to request.
     * @return {@link ServerResponse} implementation.
     * @throws DataAccessException
     *         If the database query fails.
     */
    R request(Q query) throws DataAccessException;

}

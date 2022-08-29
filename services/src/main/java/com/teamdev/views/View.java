package com.teamdev.views;

import com.teamdev.persistent.dao.DataAccessException;

/**
 * A Service Interface which is intended to process {@link Query}.
 * {@link Query} processing doesn't cause changes in the database.
 *
 * @param <Q>
 *         {@link Query} implementation.
 * @param <R>
 *         Server response type.
 */
public interface View<Q extends Query, R> {

    /**
     * Method which process {@link Query} and communicate
     * with persistent layer of application.
     *
     * @param query
     *         {@link Query} implementation to request.
     * @return Server response type.
     * @throws DataAccessException
     *         If the database query fails.
     */
    R request(Q query) throws ViewException;

}

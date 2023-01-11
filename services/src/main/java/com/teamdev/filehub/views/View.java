package com.teamdev.filehub.views;

import com.teamdev.filehub.ServiceException;

/**
 * A class for handling actor {@link Query} without application state changes.
 *
 * @param <Q>
 *         {@link Query} implementation.
 * @param <R>
 *         Server response type.
 */
public interface View<Q extends Query, R> {

    /**
     * Handle a query.
     *
     * @param query
     *         {@link Query} to handle.
     * @return Server response.
     * @throws ServiceException
     *         If {@link Query} can't be handled.
     */
    R handle(Q query) throws ServiceException;

}

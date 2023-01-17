package com.teamdev.filehub.views;

import com.teamdev.filehub.ServiceException;

/**
 * Interface whose implementations handle user {@link Query}.
 * You should implement it if you want to write a service that
 * will receive system state data at the request of the user.
 *
 * @param <Q>
 *         {@link Query} implementation.
 * @param <R>
 *         Server response type.
 */
public interface View<Q extends Query, R> {

    /**
     * Handles the user {@link Query}.
     *
     * @param query
     *         {@link Query} to handle.
     * @return Server response.
     * @throws ServiceException
     *         If {@link Query} can't be handled.
     */
    R handle(Q query) throws ServiceException;

}

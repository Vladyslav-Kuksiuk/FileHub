package com.teamdev.filehub;

import java.io.Serial;

/**
 * An {@link Exception} thrown by services when a request from the user cannot be fulfilled.
 */
public class ServiceException extends Exception {

    @Serial
    private static final long serialVersionUID = 6349729302741599637L;

    public ServiceException(String message) {
        super(message);
    }
}

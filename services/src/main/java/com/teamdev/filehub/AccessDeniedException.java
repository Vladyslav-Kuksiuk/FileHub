package com.teamdev.filehub;

import java.io.Serial;

/**
 * An {@link Exception} thrown if the user does not have the access to execute the request.
 */
public class AccessDeniedException extends ServiceException {

    @Serial
    private static final long serialVersionUID = 2465012653514227294L;

    public AccessDeniedException(String message) {
        super(message);
    }
}

package com.teamdev.filehub;

/**
 * An {@link ServiceException} thrown if the user does not have the access to execute the request.
 */
public class AccessDeniedException extends ServiceException {

    public AccessDeniedException(String message) {
        super(message);
    }
}

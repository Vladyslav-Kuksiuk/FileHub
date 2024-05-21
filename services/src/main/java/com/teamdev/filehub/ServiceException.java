package com.teamdev.filehub;


/**
 * An {@link Exception} thrown by services when a request from the user cannot be fulfilled.
 */
public class ServiceException extends Exception {

    public ServiceException(String message) {
        super(message);
    }
}

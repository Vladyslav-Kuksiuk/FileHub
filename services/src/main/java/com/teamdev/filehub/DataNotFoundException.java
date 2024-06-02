package com.teamdev.filehub;

/**
 * An {@link ServiceException} thrown if the requested data is missing from the system.
 */
public class DataNotFoundException extends ServiceException {

    public DataNotFoundException(String message) {
        super(message);
    }
}

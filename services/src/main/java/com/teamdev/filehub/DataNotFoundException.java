package com.teamdev.filehub;

import java.io.Serial;

/**
 * An {@link ServiceException} thrown if the requested data is missing from the system.
 */
public class DataNotFoundException extends ServiceException {

    @Serial
    private static final long serialVersionUID = 1513192742417354939L;

    public DataNotFoundException(String message) {
        super(message);
    }
}

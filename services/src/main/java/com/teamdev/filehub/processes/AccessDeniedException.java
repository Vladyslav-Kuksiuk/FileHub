package com.teamdev.filehub.processes;

import javax.annotation.Nonnull;
import java.io.Serial;

/**
 * An exception is thrown when access is denied.
 */
public class AccessDeniedException extends ProcessException{

    @Serial
    private static final long serialVersionUID = 1704402770800628304L;

    public AccessDeniedException(@Nonnull String message) {
        super(message);
    }
}

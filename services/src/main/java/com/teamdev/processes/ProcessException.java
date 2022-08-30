package com.teamdev.processes;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;
import java.io.Serial;

/**
 * {@link Exception} implementation thrown in case the {@link Command} cannot be handled.
 */
public class ProcessException extends Exception {

    @Serial
    private static final long serialVersionUID = 4898556067597443976L;

    public ProcessException(@Nonnull String message) {
        super(Preconditions.checkNotNull(message));
    }
}

package com.teamdev.filehub.processes;

import java.io.Serial;

public class CommandValidationException extends Exception {

    @Serial
    private static final long serialVersionUID = 2058497570904546083L;

    public CommandValidationException(String message) {
        super(message);
    }
}

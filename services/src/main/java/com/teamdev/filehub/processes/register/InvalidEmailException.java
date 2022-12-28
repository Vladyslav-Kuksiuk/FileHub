package com.teamdev.filehub.processes.register;

import com.teamdev.filehub.processes.ProcessException;

/**
 * Exception thrown in case of invalid email.
 */
public class InvalidEmailException extends ProcessException {

    public InvalidEmailException() {
        super("Invalid email.");
    }
}

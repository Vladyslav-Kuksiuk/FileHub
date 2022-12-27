package com.teamdev.filehub.processes.register;

import com.teamdev.filehub.processes.ProcessException;

public class InvalidEmailException extends ProcessException {

    public InvalidEmailException() {
        super("Invalid email.");
    }
}

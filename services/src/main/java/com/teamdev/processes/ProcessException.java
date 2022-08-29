package com.teamdev.processes;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;

public class ProcessException extends Exception {

    public ProcessException(@Nonnull String message) {
        super(Preconditions.checkNotNull(message));
    }
}

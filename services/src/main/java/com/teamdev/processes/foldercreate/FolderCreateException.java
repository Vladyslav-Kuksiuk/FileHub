package com.teamdev.processes.foldercreate;

import com.teamdev.processes.ProcessException;

import javax.annotation.Nonnull;
import java.io.Serial;

public class FolderCreateException extends ProcessException {

    @Serial
    private static final long serialVersionUID = 8087881005675230244L;

    public FolderCreateException(@Nonnull String message) {
        super(message);
    }
}

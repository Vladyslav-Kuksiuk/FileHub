package com.teamdev.filehub.processes.foldercreate;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;
import java.io.Serial;

public class FolderCreateException extends ServiceException {

    @Serial
    private static final long serialVersionUID = 8087881005675230244L;

    public FolderCreateException(@Nonnull String message) {
        super(message);
    }
}

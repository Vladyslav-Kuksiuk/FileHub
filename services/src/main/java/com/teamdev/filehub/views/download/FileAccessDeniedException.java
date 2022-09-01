package com.teamdev.filehub.views.download;

import com.teamdev.filehub.views.ViewException;

import javax.annotation.Nonnull;

public class FileAccessDeniedException extends ViewException {

    public FileAccessDeniedException(@Nonnull String message) {
        super(message);
    }
}

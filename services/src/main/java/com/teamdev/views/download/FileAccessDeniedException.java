package com.teamdev.views.download;

import com.teamdev.views.ViewException;

import javax.annotation.Nonnull;

public class FileAccessDeniedException extends ViewException {

    public FileAccessDeniedException(@Nonnull String message) {
        super(message);
    }
}

package com.teamdev.filehub.views.download;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;

public class FileAccessDeniedException extends ServiceException {

    public FileAccessDeniedException(@Nonnull String message) {
        super(message);
    }
}

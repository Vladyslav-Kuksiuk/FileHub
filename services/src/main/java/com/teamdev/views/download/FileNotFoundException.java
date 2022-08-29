package com.teamdev.views.download;

import com.teamdev.views.ViewException;

import javax.annotation.Nonnull;

public class FileNotFoundException extends ViewException {

    public FileNotFoundException(@Nonnull String message) {
        super(message);
    }
}

package com.teamdev.views;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;

public class ViewException extends Exception {

    public ViewException(@Nonnull String message) {
        super(Preconditions.checkNotNull(message));
    }
}

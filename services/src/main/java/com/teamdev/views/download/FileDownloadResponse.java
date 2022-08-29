package com.teamdev.views.download;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;
import java.io.InputStream;

/**
 * Server response which is intended to store
 * information about the file downloading server's response.
 */
public class FileDownloadResponse {

    private final InputStream fileInput;

    public FileDownloadResponse(@Nonnull InputStream fileInput) {
        this.fileInput = Preconditions.checkNotNull(fileInput);
    }

    public InputStream fileInput() {
        return fileInput;
    }
}

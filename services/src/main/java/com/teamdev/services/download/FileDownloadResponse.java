package com.teamdev.services.download;

import com.google.common.base.Preconditions;
import com.teamdev.services.ServerResponse;

import javax.annotation.Nonnull;
import java.io.InputStream;

/**
 * {@link ServerResponse} implementation which is intended to store
 * information about the file downloading server's response.
 */
public class FileDownloadResponse implements ServerResponse {

    private final InputStream fileInput;

    public FileDownloadResponse(@Nonnull InputStream fileInput) {
        this.fileInput = Preconditions.checkNotNull(fileInput);
    }

    public InputStream fileInput() {
        return fileInput;
    }
}

package com.teamdev.services.download;

import com.google.common.base.Preconditions;
import com.teamdev.services.ServerResponse;

import javax.annotation.Nonnull;
import java.io.InputStream;

public class FileDownloadResponse implements ServerResponse {

    private final InputStream fileInput;

    public FileDownloadResponse(@Nonnull InputStream fileInput) {
        this.fileInput = Preconditions.checkNotNull(fileInput);
    }

    public InputStream fileInput() {
        return fileInput;
    }
}

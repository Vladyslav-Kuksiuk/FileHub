package com.teamdev.processes.upload;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.processes.CommandWithAuthorizationData;

import javax.annotation.Nonnull;
import java.io.InputStream;

/**
 * A {@link CommandWithAuthorizationData} implementation which is intended to store
 * data about file uploading.
 */
public class FileUploadCommand extends CommandWithAuthorizationData {

    private final String filePath;
    private final InputStream fileInputStream;

    protected FileUploadCommand(
            @Nonnull RecordIdentifier<String> userId,
            @Nonnull String authenticationToken,
            @Nonnull String filePath,
            @Nonnull InputStream fileInputStream) {
        super(userId, authenticationToken);

        this.filePath = Preconditions.checkNotNull(filePath);
        this.fileInputStream = Preconditions.checkNotNull(fileInputStream);

    }

    public String filePath() {
        return filePath;
    }

    public InputStream fileInputStream() {
        return fileInputStream;
    }
}

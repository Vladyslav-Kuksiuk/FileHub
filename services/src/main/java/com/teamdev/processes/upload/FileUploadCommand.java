package com.teamdev.processes.upload;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;
import java.io.InputStream;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about file uploading.
 */
public class FileUploadCommand extends AuthenticatedUserCommand {

    private final RecordId<String> folderId;
    private final String fileName;
    private final String fileExtension;
    private final InputStream fileInputStream;

    protected FileUploadCommand(
            @Nonnull RecordId<String> userId,
            @Nonnull RecordId<String> folderId,
            @Nonnull String fileName,
            @Nonnull String fileExtension,
            @Nonnull InputStream fileInputStream) {
        super(userId);

        this.folderId = Preconditions.checkNotNull(folderId);
        this.fileName = Preconditions.checkNotNull(fileName);
        this.fileExtension = Preconditions.checkNotNull(fileExtension);
        this.fileInputStream = Preconditions.checkNotNull(fileInputStream);

    }

    public RecordId<String> folderId() {
        return folderId;
    }

    public String fileName() {
        return fileName;
    }

    public String fileExtension() {
        return fileExtension;
    }

    public InputStream fileInputStream() {
        return fileInputStream;
    }
}

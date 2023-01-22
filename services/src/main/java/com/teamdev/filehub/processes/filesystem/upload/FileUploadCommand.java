package com.teamdev.filehub.processes.filesystem.upload;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;
import java.io.InputStream;

/**
 * A {@link AuthenticatedUserCommand} implementation to represent 'upload file' request.
 */
public class FileUploadCommand extends AuthenticatedUserCommand {

    private final RecordId folderId;
    private final String name;
    private final String mimetype;
    private final long size;
    private final InputStream fileInputStream;

    public FileUploadCommand(
            @Nonnull RecordId userId,
            @Nonnull RecordId folderId,
            @Nonnull String name,
            @Nonnull String mimetype,
            long size,
            @Nonnull InputStream inputStream) {
        super(userId);

        this.folderId = Preconditions.checkNotNull(folderId);
        this.name = Preconditions.checkNotNull(name);
        this.mimetype = Preconditions.checkNotNull(mimetype);
        this.size = size;
        this.fileInputStream = Preconditions.checkNotNull(inputStream);

    }

    public RecordId folderId() {
        return folderId;
    }

    public String name() {
        return name;
    }

    public String mimetype() {
        return mimetype;
    }

    public InputStream inputStream() {
        return fileInputStream;
    }

    public long size() {
        return size;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(folderId, name, mimetype, size, fileInputStream);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FileUploadCommand)) {
            return false;
        }
        FileUploadCommand command = (FileUploadCommand) o;
        return size == command.size &&
                Objects.equal(folderId, command.folderId) &&
                Objects.equal(name, command.name) &&
                Objects.equal(mimetype, command.mimetype) &&
                Objects.equal(fileInputStream, command.fileInputStream);
    }
}

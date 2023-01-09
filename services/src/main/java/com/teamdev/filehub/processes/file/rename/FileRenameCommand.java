package com.teamdev.filehub.processes.file.rename;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about file renaming.
 */
public class FileRenameCommand extends AuthenticatedUserCommand {

    private final RecordId<String> fileId;
    private final String newName;

    public FileRenameCommand(@Nonnull RecordId<String> userId,
                             RecordId<String> fileId,
                             String newName) {
        super(userId);
        this.fileId = Preconditions.checkNotNull(fileId);
        this.newName = Preconditions.checkNotNull(newName);
    }

    public RecordId<String> fileId() {
        return fileId;
    }

    public String newName() {
        return newName;
    }
}

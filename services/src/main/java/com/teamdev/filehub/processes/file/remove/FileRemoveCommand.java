package com.teamdev.filehub.processes.file.remove;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about file removing.
 */
public class FileRemoveCommand extends AuthenticatedUserCommand {

    private final RecordId<String> fileId;

    public FileRemoveCommand(@Nonnull RecordId<String> userId,
                             RecordId<String> fileId) {
        super(userId);
        this.fileId = fileId;
    }

    public RecordId<String> fileId() {
        return fileId;
    }
}

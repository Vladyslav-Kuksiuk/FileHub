package com.teamdev.filehub.processes.folder.remove;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about folder removing.
 */
public class FolderRemoveCommand extends AuthenticatedUserCommand {

    private final RecordId<String> folderId;

    public FolderRemoveCommand(@Nonnull RecordId<String> userId,
                               RecordId<String> folderId) {
        super(userId);
        this.folderId = Preconditions.checkNotNull(folderId);
    }

    public RecordId<String> folderId() {
        return folderId;
    }
}

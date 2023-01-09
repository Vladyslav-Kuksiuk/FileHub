package com.teamdev.filehub.processes.folder.rename;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about folder renaming.
 */
public class FolderRenameCommand extends AuthenticatedUserCommand {

    private final RecordId<String> folderId;
    private final String newName;

    public FolderRenameCommand(@Nonnull RecordId<String> userId,
                               RecordId<String> fileId,
                               String newName) {
        super(userId);
        this.folderId = Preconditions.checkNotNull(fileId);
        this.newName = Preconditions.checkNotNull(newName);
    }

    public RecordId<String> folderId() {
        return folderId;
    }

    public String newName() {
        return newName;
    }
}

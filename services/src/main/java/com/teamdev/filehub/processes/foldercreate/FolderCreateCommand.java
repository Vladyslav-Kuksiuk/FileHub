package com.teamdev.filehub.processes.foldercreate;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about folder creation.
 */
public class FolderCreateCommand extends AuthenticatedUserCommand {

    private final RecordId<String> parentFolderId;

    private final String folderName;

    protected FolderCreateCommand(
            @Nonnull RecordId<String> userId,
            @Nonnull RecordId<String> parentFolderId,
            @Nonnull String folderName) {
        super(userId);
        this.parentFolderId = Preconditions.checkNotNull(parentFolderId);
        this.folderName = Preconditions.checkNotNull(folderName);
    }

    public RecordId<String> parentFolderId() {
        return parentFolderId;
    }

    public String folderName() {
        return folderName;
    }
}

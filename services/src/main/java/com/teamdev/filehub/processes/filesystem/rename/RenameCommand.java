package com.teamdev.filehub.processes.filesystem.rename;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about renaming.
 */
public class RenameCommand extends AuthenticatedUserCommand {

    private final RecordId<String> itemId;
    private final String newName;

    public RenameCommand(@Nonnull RecordId<String> userId,
                         @Nonnull RecordId<String> itemId,
                         @Nonnull String newName) {

        super(userId);
        this.itemId = Preconditions.checkNotNull(itemId);
        this.newName = Preconditions.checkNotNull(newName);
    }

    public RecordId<String> itemId() {
        return itemId;
    }

    public String newName() {
        return newName;
    }
}

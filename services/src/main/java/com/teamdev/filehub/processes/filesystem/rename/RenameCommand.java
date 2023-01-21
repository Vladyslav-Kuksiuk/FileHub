package com.teamdev.filehub.processes.filesystem.rename;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about renaming.
 */
public class RenameCommand extends AuthenticatedUserCommand {

    private final RecordId itemId;
    private final String newName;

    public RenameCommand(@Nonnull RecordId userId,
                         @Nonnull RecordId itemId,
                         @Nonnull String newName) {

        super(userId);
        this.itemId = Preconditions.checkNotNull(itemId);
        this.newName = Preconditions.checkNotNull(newName);
    }

    public RecordId itemId() {
        return itemId;
    }

    public String newName() {
        return newName;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(itemId, newName);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RenameCommand)) {
            return false;
        }
        RenameCommand command = (RenameCommand) o;
        return Objects.equal(userId(), command.userId()) &&
                Objects.equal(itemId, command.itemId) &&
                Objects.equal(newName, command.newName);
    }
}

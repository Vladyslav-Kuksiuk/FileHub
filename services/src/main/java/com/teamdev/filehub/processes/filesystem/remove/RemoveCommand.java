package com.teamdev.filehub.processes.filesystem.remove;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about file removing.
 */
public class RemoveCommand extends AuthenticatedUserCommand {

    private final RecordId itemId;

    public RemoveCommand(@Nonnull RecordId userId,
                         @Nonnull RecordId itemId) {

        super(Preconditions.checkNotNull(userId));
        this.itemId = Preconditions.checkNotNull(itemId);
    }

    public RecordId itemId() {
        return itemId;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(itemId);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RemoveCommand)) {
            return false;
        }
        RemoveCommand command = (RemoveCommand) o;
        return Objects.equal(userId(), command.userId()) &&
                Objects.equal(itemId, command.itemId);
    }
}

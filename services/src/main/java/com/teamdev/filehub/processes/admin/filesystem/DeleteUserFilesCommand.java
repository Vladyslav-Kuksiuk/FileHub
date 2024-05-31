package com.teamdev.filehub.processes.admin.filesystem;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedAdminCommand;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation to represent 'remove item' request.
 */
public class DeleteUserFilesCommand extends AuthenticatedAdminCommand {

    private final String targetUserEmail;

    public DeleteUserFilesCommand(@Nonnull RecordId userId,
                                  @Nonnull String targetUserEmail) {

        super(Preconditions.checkNotNull(userId));
        this.targetUserEmail = Preconditions.checkNotNull(targetUserEmail);
    }

    public String targetUserEmail() {
        return targetUserEmail;
    }
}

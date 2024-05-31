package com.teamdev.filehub.processes.filesystem.share;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;

/**
 * A {@link AuthenticatedUserCommand} implementation to represent 'share/stop sharing file' request.
 */
public class ChangeFileShareStatusCommand extends AuthenticatedUserCommand {

    private final RecordId fileId;
    private final boolean shareStatus;

    public ChangeFileShareStatusCommand(
            @Nonnull RecordId userId,
            @Nonnull RecordId fileId,
            boolean shareStatus) {
        super(userId);
        Preconditions.checkNotNull(userId);

        this.fileId = Preconditions.checkNotNull(fileId);
        this.shareStatus = shareStatus;
    }

    public RecordId fileId() {
        return fileId;
    }

    public boolean shareStatus() {
        return shareStatus;
    }
}

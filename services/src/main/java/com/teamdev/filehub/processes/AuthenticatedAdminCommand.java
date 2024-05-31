package com.teamdev.filehub.processes;

import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * An abstract {@link Command} with an authenticated admin.
 */
public class AuthenticatedAdminCommand implements Command {

    private final RecordId userId;

    protected AuthenticatedAdminCommand(@Nonnull RecordId userId) {
        this.userId = userId;
    }

    public RecordId userId() {
        return userId;
    }
}

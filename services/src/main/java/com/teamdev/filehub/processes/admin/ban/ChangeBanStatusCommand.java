package com.teamdev.filehub.processes.admin.ban;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedAdminCommand;
import com.teamdev.filehub.processes.Command;

import javax.annotation.Nonnull;

/**
 * A {@link Command} implementation to represent 'authenticate admin' request.
 */
public class ChangeBanStatusCommand extends AuthenticatedAdminCommand {

    private final String targetUserEmail;
    private final boolean banStatus;

    public ChangeBanStatusCommand(@Nonnull RecordId adminId, String targetUserEmail, boolean banStatus) {
        super(adminId);
        this.targetUserEmail = targetUserEmail;
        this.banStatus = banStatus;
    }

    public String targetUserEmail() {
        return targetUserEmail;
    }

    public boolean banStatus() {
        return banStatus;
    }

}

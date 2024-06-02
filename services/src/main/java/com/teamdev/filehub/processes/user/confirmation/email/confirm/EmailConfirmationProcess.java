package com.teamdev.filehub.processes.user.confirmation.email.confirm;

import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;

public interface EmailConfirmationProcess extends ApplicationProcess<EmailConfirmationCommand, RecordId> {

    @Override
    RecordId handle(EmailConfirmationCommand command) throws DataNotFoundException;
}

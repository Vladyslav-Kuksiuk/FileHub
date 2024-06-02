package com.teamdev.filehub.processes.user.confirmation.email.send;

import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.user.confirmation.email.confirm.EmailConfirmationCommand;

public interface SendEmailConfirmationProcess extends ApplicationProcess<SendEmailConfirmationCommand, RecordId> {

    @Override
    RecordId handle(SendEmailConfirmationCommand command) throws DataNotFoundException;
}

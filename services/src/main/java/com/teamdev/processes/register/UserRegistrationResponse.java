package com.teamdev.processes.register;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.annotation.Nonnull;

/**
 * Server response which is intended to store
 * information about the user registration server's response.
 */
public class UserRegistrationResponse {

    private final RecordIdentifier<String> userId;

    public UserRegistrationResponse(@Nonnull RecordIdentifier<String> userId) {
        this.userId = Preconditions.checkNotNull(userId);
    }

    public RecordIdentifier<String> userId() {
        return userId;
    }
}

package com.teamdev.services.register;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.services.ServerResponse;

import javax.annotation.Nonnull;

/**
 * {@link ServerResponse} implementation which is intended to store
 * information about the user registration server's response.
 */
public class UserRegistrationResponse implements ServerResponse {

    private final RecordIdentifier<String> userId;

    public UserRegistrationResponse(@Nonnull RecordIdentifier<String> userId) {
        this.userId = Preconditions.checkNotNull(userId);
    }

    public RecordIdentifier<String> userId() {
        return userId;
    }
}

package com.teamdev.services.register;

import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.services.ServerResponse;

import javax.validation.constraints.NotNull;

/**
 * {@link ServerResponse} implementation which is intended to store
 * information about the user registration server's response.
 */
public class UserRegistrationResponse implements ServerResponse {

    private final RecordIdentifier<String> userId;

    public UserRegistrationResponse(@NotNull RecordIdentifier<String> userId) {
        this.userId = userId;
    }

    public RecordIdentifier<String> userId() {
        return userId;
    }
}

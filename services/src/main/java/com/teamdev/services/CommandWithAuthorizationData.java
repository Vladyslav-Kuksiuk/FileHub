package com.teamdev.services;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.validation.constraints.NotNull;

public abstract class CommandWithAuthorizationData implements Command {

    private final RecordIdentifier<String> userId;

    private final String authenticationToken;

    protected CommandWithAuthorizationData(@NotNull RecordIdentifier<String> userId,
                                           @NotNull String authenticationToken) {
        this.userId = Preconditions.checkNotNull(userId);
        this.authenticationToken = Preconditions.checkNotNull(authenticationToken);
    }

    public RecordIdentifier<String> userId() {
        return userId;
    }

    public String authenticationToken() {
        return authenticationToken;
    }
}

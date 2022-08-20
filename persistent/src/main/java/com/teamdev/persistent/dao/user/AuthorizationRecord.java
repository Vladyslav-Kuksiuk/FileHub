package com.teamdev.persistent.dao.user;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DatabaseRecord;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * {@link DatabaseRecord} implementation which is intended to
 * store data about user authorization.
 */
public class AuthorizationRecord extends DatabaseRecord<String> {

    private final RecordIdentifier<String> userId;
    private final String authenticationToken;
    private final Date authorizationTime;

    public AuthorizationRecord(@NotNull RecordIdentifier<String> id,
                               @NotNull RecordIdentifier<String> userId,
                               @NotNull String authenticationToken,
                               @NotNull Date authorizationTime) {
        super(Preconditions.checkNotNull(id));

        Preconditions.checkNotNull(userId);
        Preconditions.checkNotNull(authenticationToken);
        Preconditions.checkNotNull(authorizationTime);

        this.userId = userId;
        this.authenticationToken = authenticationToken;
        this.authorizationTime = new Date(authorizationTime.getTime());
    }

    public RecordIdentifier<String> userId() {
        return userId;
    }

    public String authenticationToken() {
        return authenticationToken;
    }

    public Date authorizationTime() {
        return new Date(authorizationTime.getTime());
    }
}

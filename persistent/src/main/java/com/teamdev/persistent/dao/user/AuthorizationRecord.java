package com.teamdev.persistent.dao.user;

import com.teamdev.persistent.dao.DatabaseRecord;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * {@link DatabaseRecord} implementation which is intended to
 * store data about user authorization.
 */
public class AuthorizationRecord extends DatabaseRecord<String> {

    private final String authenticationToken;
    private final Date authorizationTime;

    public AuthorizationRecord(@NotNull RecordIdentifier<String> userId,
                               @NotNull String authenticationToken,
                               @NotNull Date authorizationTime) {
        super(userId);

        this.authenticationToken = authenticationToken;
        this.authorizationTime = new Date(authorizationTime.getTime());
    }

    public String getAuthenticationToken() {
        return authenticationToken;
    }

    public Date getAuthorizationTime() {
        return new Date(authorizationTime.getTime());
    }
}

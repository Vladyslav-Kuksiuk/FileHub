package com.teamdev.persistent.dao.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DatabaseRecord;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * {@link DatabaseRecord} implementation which is intended to
 * store data about user authentication.
 */
public class AuthenticationRecord extends DatabaseRecord<String> {

    private final String authenticationToken;
    private final Date authorizationTime;

    public AuthenticationRecord(@NotNull RecordIdentifier<String> id,
                                @NotNull String authenticationToken,
                                @NotNull Date authorizationTime) {
        super(Preconditions.checkNotNull(id));

        Preconditions.checkNotNull(authenticationToken);
        Preconditions.checkNotNull(authorizationTime);

        this.authenticationToken = authenticationToken;
        this.authorizationTime = new Date(authorizationTime.getTime());
    }

    public String authenticationToken() {
        return authenticationToken;
    }

    public Date authorizationTime() {
        return new Date(authorizationTime.getTime());
    }
}

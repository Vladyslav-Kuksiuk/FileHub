package com.teamdev.persistent.dao.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DatabaseRecord;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * {@link DatabaseRecord} implementation which is intended to
 * store data about user authentication.
 */
public class AuthenticationRecord extends DatabaseRecord<String> {

    private final String authenticationToken;
    private final LocalDateTime expireTime;

    public AuthenticationRecord(@NotNull RecordIdentifier<String> id,
                                @NotNull String authenticationToken,
                                @NotNull LocalDateTime expireTime) {
        super(Preconditions.checkNotNull(id));

        Preconditions.checkNotNull(authenticationToken);
        Preconditions.checkNotNull(expireTime);

        this.authenticationToken = authenticationToken;
        this.expireTime = expireTime;
    }

    public String authenticationToken() {
        return authenticationToken;
    }

    public LocalDateTime expireTime() {
        return expireTime;
    }
}

package com.teamdev.persistent.dao.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DatabaseRecord;
import com.teamdev.persistent.dao.RecordId;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;

/**
 * {@link DatabaseRecord} implementation which is intended to
 * store data about user authentication.
 */
public class AuthenticationRecord extends DatabaseRecord<String> {

    private final String authenticationToken;
    private final LocalDateTime expireTime;

    public AuthenticationRecord(@Nonnull RecordId<String> id,
                                @Nonnull String authenticationToken,
                                @Nonnull LocalDateTime expireTime) {
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

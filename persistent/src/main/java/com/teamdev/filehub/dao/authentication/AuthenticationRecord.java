package com.teamdev.filehub.dao.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.DatabaseRecord;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;

/**
 * {@link DatabaseRecord} implementation which is intended to
 * store data about user authentication.
 */
public class AuthenticationRecord extends DatabaseRecord {

    private final String authenticationToken;
    private final LocalDateTime expireTime;
    private final RecordId userId;

    public AuthenticationRecord(@Nonnull RecordId id,
                                @Nonnull String authenticationToken,
                                @Nonnull LocalDateTime expireTime,
                                @Nonnull RecordId userId) {
        super(Preconditions.checkNotNull(id));

        Preconditions.checkNotNull(authenticationToken);
        Preconditions.checkNotNull(expireTime);
        Preconditions.checkNotNull(userId);

        this.authenticationToken = authenticationToken;
        this.expireTime = expireTime;
        this.userId = userId;
    }

    public String authenticationToken() {
        return authenticationToken;
    }

    public LocalDateTime expireTime() {
        return expireTime;
    }

    public RecordId userId() {
        return userId;
    }
}

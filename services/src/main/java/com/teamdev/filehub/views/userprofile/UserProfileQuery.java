package com.teamdev.filehub.views.userprofile;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AuthenticatedUserQuery;

import javax.annotation.Nonnull;

/**
 * An {@link AuthenticatedUserQuery} implementation to represent 'load user profile' request.
 */
public class UserProfileQuery extends AuthenticatedUserQuery {

    public UserProfileQuery(@Nonnull RecordId userId) {
        super(Preconditions.checkNotNull(userId));
    }
}

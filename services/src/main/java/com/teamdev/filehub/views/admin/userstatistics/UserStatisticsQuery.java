package com.teamdev.filehub.views.admin.userstatistics;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AuthenticatedAdminQuery;
import com.teamdev.filehub.views.AuthenticatedUserQuery;

import javax.annotation.Nonnull;

/**
 * An {@link AuthenticatedUserQuery} implementation to represent 'load user profile' request.
 */
public class UserStatisticsQuery extends AuthenticatedAdminQuery {

    private final String targetUserEmail;

    public UserStatisticsQuery(@Nonnull RecordId userId,
                               @Nonnull String targetUserEmail) {
        super(userId);
        this.targetUserEmail = targetUserEmail;
    }

    public String targetUserEmail() {
        return targetUserEmail;
    }
}

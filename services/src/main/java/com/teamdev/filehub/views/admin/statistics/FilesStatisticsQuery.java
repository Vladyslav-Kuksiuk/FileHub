package com.teamdev.filehub.views.admin.statistics;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.AuthenticatedAdminQuery;
import com.teamdev.filehub.views.AuthenticatedUserQuery;

import javax.annotation.Nonnull;

/**
 * An {@link AuthenticatedUserQuery} implementation to represent 'load user profile' request.
 */
public class FilesStatisticsQuery extends AuthenticatedAdminQuery {

    public FilesStatisticsQuery(@Nonnull RecordId userId) {
        super(userId);
    }
}

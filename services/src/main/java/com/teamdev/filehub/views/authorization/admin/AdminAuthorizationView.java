package com.teamdev.filehub.views.authorization.admin;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.View;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;

/**
 * A {@link View} extended interface which implementation is intended to process
 * user authorization.
 * Authorization converts authentication token into user id.
 */
public interface AdminAuthorizationView extends View<AdminAuthorizationQuery, RecordId> {

    @Override
    RecordId handle(AdminAuthorizationQuery query) throws UserAuthorizationException;
}

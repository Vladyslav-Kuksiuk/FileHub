package com.teamdev.filehub.views.authorization;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.View;

/**
 * A {@link View} extended interface which implementation is intended to process
 * user authorization.
 * Authorization converts authentication token into user id.
 */
public interface UserAuthorizationView extends View<UserAuthorizationQuery, RecordId> {

    @Override
    RecordId handle(UserAuthorizationQuery query) throws UserAuthorizationException;
}

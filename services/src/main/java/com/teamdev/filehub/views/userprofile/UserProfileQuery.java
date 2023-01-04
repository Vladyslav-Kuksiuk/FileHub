package com.teamdev.filehub.views.userprofile;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.Query;

/**
 * A {@link Query} implementation which is intended to store
 * data about user profile query.
 */
public class UserProfileQuery implements Query {

    private final RecordId<String> userId;

    public UserProfileQuery(RecordId<String> userId) {
        this.userId = userId;
    }

    public RecordId<String> userId() {
        return userId;
    }
}

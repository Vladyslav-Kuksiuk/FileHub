package com.teamdev.filehub.views.userprofile;

import com.teamdev.filehub.views.View;

/**
 * {@link View} to handle {@link UserProfileQuery}.
 */
public interface UserProfileView extends View<UserProfileQuery, UserProfile> {
    @Override
    UserProfile handle(UserProfileQuery query);
}

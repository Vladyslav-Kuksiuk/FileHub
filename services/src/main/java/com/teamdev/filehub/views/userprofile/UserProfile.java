package com.teamdev.filehub.views.userprofile;

/**
 * Server response which is intended to store
 * information about the user profile.
 */
public class UserProfile {

    private final String username;
    private final String rootFolderId;

    public UserProfile(String username, String rootFolderId) {
        this.username = username;
        this.rootFolderId = rootFolderId;
    }

    public String username() {
        return username;
    }

    public String rootFolderId() {
        return rootFolderId;
    }
}

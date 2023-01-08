package com.teamdev.filehub.views.userprofile;

/**
 * Server response which is intended to store
 * information about the user profile.
 */
public class UserProfile {

    private final String login;
    private final String rootFolderId;

    public UserProfile(String login, String rootFolderId) {
        this.login = login;
        this.rootFolderId = rootFolderId;
    }

    public String username() {
        return login;
    }

    public String rootFolderId() {
        return rootFolderId;
    }
}

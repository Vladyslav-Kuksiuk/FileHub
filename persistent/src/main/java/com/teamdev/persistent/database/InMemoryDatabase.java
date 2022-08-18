package com.teamdev.persistent.database;

import com.teamdev.persistent.database.user.UserTable;

/**
 * Database imitation.
 */
public class InMemoryDatabase {

    private final UserTable userTable = new UserTable();

    public UserTable userTable() {
        return userTable;
    }

}

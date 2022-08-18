package com.teamdev.database;

import com.teamdev.database.user.UserTable;

/**
 * Database imitation.
 */
public class InMemoryDatabase {

    private final UserTable userTable = new UserTable();

    public UserTable userTable() {
        return userTable;
    }

    public void clean() throws DatabaseException {
        userTable.clean();
    }

}

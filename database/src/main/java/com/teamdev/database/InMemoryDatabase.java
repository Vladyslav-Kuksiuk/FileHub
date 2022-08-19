package com.teamdev.database;

import com.teamdev.database.user.UserTable;

/**
 * Database imitation.
 */
public class InMemoryDatabase {

    public static final String DATABASE_FOLDER_PATH = "D:\\Work\\DatabaseFolder\\Tables\\";

    private final UserTable userTable = new UserTable();

    public UserTable userTable() {
        return userTable;
    }

    public void clean() throws DatabaseException {
        userTable.clean();
    }

}

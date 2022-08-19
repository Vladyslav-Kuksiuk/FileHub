package com.teamdev.database;

import com.teamdev.database.user.AuthorizationTable;
import com.teamdev.database.user.UserTable;

/**
 * Database imitation.
 */
public class InMemoryDatabase {

    public static final String DATABASE_FOLDER_PATH = "D:\\Work\\DatabaseFolder\\Tables\\";

    private final UserTable userTable = new UserTable();
    private final AuthorizationTable authorizationTable = new AuthorizationTable();

    public UserTable userTable() {
        return userTable;
    }

    public AuthorizationTable authorizationTable() {
        return authorizationTable;
    }

    public void clean() throws DatabaseException {
        userTable.clean();
        authorizationTable.clean();
    }

}

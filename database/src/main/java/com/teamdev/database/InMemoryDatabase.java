package com.teamdev.database;

import com.teamdev.database.user.AuthenticationTable;
import com.teamdev.database.user.UserTable;

/**
 * Database imitation.
 */
public class InMemoryDatabase {

    public static final String DATABASE_FOLDER_PATH = "D:\\Work\\DatabaseFolder\\Tables\\";

    private final UserTable userTable = new UserTable();
    private final AuthenticationTable authenticationTable = new AuthenticationTable();

    public InMemoryDatabase() throws DatabaseException {
    }

    public UserTable userTable() {
        return userTable;
    }

    public AuthenticationTable authenticationTable() {
        return authenticationTable;
    }

    public void clean() throws DatabaseException {
        userTable.clean();
        authenticationTable.clean();
    }

}

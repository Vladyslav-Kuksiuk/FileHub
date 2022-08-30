package com.teamdev.database;

import com.teamdev.database.authentication.AuthenticationTable;
import com.teamdev.database.file.FileTable;
import com.teamdev.database.user.UserTable;

import java.io.File;

/**
 * Database which tables store data in memory and synchronize it with file.
 */
public class InMemoryDatabase {

    public static final String DATABASE_FOLDER_PATH = "D:\\Work\\DatabaseFolder\\";
    public static final String DATABASE_TABLES_FOLDER_PATH = DATABASE_FOLDER_PATH + "Tables\\";
    private final UserTable userTable;
    private final AuthenticationTable authenticationTable;
    private final FileTable fileTable;

    public InMemoryDatabase() {

        File tablesDirectory = new File(DATABASE_TABLES_FOLDER_PATH);
        if (!tablesDirectory.exists()) {
            tablesDirectory.mkdirs();
        }

        userTable = new UserTable();
        authenticationTable = new AuthenticationTable();
        fileTable = new FileTable();
    }

    public UserTable userTable() {
        return userTable;
    }

    public AuthenticationTable authenticationTable() {
        return authenticationTable;
    }

    public FileTable fileTable() {
        return fileTable;
    }

    public void clean() {
        userTable.clean();
        authenticationTable.clean();
        fileTable.clean();
    }

}

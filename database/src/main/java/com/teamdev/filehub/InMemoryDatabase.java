package com.teamdev.filehub;

import com.teamdev.filehub.authentication.AuthenticationTable;
import com.teamdev.filehub.file.FileTable;
import com.teamdev.filehub.folder.FolderTable;
import com.teamdev.filehub.user.UserTable;

import javax.annotation.Nonnull;
import java.io.File;

/**
 * Database which tables store data in memory and synchronize it with file.
 */
public class InMemoryDatabase {

    private final UserTable userTable;
    private final AuthenticationTable authenticationTable;
    private final FileTable fileTable;

    private final FolderTable folderTable;

    public InMemoryDatabase(@Nonnull String databaseFolderPath) {

        String tablesFolderPath =
                databaseFolderPath + File.separator + "Tables" + File.separator;

        File tablesDirectory =
                new File(tablesFolderPath);
        if (!tablesDirectory.exists()) {
            tablesDirectory.mkdirs();
        }

        userTable = new UserTable(tablesFolderPath + "users.json");
        authenticationTable = new AuthenticationTable(tablesFolderPath + "authentications.json");
        fileTable = new FileTable(tablesFolderPath + "files.json");
        folderTable = new FolderTable(tablesFolderPath + "folders.json");
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

    public FolderTable folderTable() {
        return folderTable;
    }

    public void clean() {
        userTable.clean();
        authenticationTable.clean();
        fileTable.clean();
        folderTable.clean();
    }

}

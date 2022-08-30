package com.teamdev.database.file;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.InMemoryDatabaseTable;

/**
 * {@link InMemoryDatabaseTable} implementation to store {@link FileData}.
 */
public class FileTable extends InMemoryDatabaseTable<String, FileData> {

    private static final String FILE_NAME = "files.json";

    public FileTable() throws
                       DatabaseException {
        super(FILE_NAME, FileData[].class);
    }

}

package com.teamdev.database.folder;

import com.teamdev.database.InMemoryDatabaseTable;

public class FolderTable extends InMemoryDatabaseTable<String, FolderData> {

    private static final String FILE_NAME = "folders.json";

    public FolderTable() {
        super(FILE_NAME, FolderData[].class);
    }

}

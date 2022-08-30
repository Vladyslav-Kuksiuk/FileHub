package com.teamdev.database.folder;

import com.teamdev.database.InMemoryDatabaseTable;

import javax.annotation.Nonnull;

public class FolderTable extends InMemoryDatabaseTable<String, FolderData> {

    protected FolderTable(@Nonnull String fileName) {
        super(fileName, FolderData[].class);
    }

}

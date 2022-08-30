package com.teamdev.database.folder;

import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabaseTable;

import java.util.List;
import java.util.stream.Collectors;

public class FolderTable extends InMemoryDatabaseTable<String, FolderData> {

    private static final String FILE_NAME = "folders.json";

    public FolderTable() {
        super(FILE_NAME, FolderData[].class);
    }

    public List<FolderData> selectWithSameParentId(String parentId) throws
                                                                    DatabaseTransactionException {

        if (!tableMap().containsKey(parentId)) {
            throw new DatabaseTransactionException("Folder with this id doesn't exist.");
        }

        return tableMap().values()
                         .stream()
                         .filter(data -> data.parentFolderId()
                                             .equals(parentId))
                         .collect(Collectors.toList());
    }

}

package com.teamdev.filehub.folder;

import com.teamdev.filehub.InMemoryDatabaseTable;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.stream.Collectors;

/**
 * {@link InMemoryDatabaseTable} implementation to store {@link FolderData}.
 */
public class FolderTable extends InMemoryDatabaseTable<String, FolderData> {

    public FolderTable(@Nonnull String filePath) {
        super(filePath, FolderData[].class);
    }

    public List<FolderData> selectWithSameParentId(String parentId) {

        if (!tableMap().containsKey(parentId)) {
            throw new RuntimeException("Folder with this id doesn't exist.");
        }

        return tableMap().values()
                .stream()
                .filter(data -> data.parentFolderId()
                                    .equals(parentId))
                .collect(Collectors.toList());
    }

}

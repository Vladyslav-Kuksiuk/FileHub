package com.teamdev.filehub.file;

import com.teamdev.filehub.InMemoryDatabaseTable;

import java.util.List;
import java.util.stream.Collectors;

/**
 * {@link InMemoryDatabaseTable} implementation to store {@link FileData}.
 */
public class FileTable extends InMemoryDatabaseTable<String, FileData> {

    private static final String FILE_NAME = "files.json";

    public FileTable() {
        super(FILE_NAME, FileData[].class);
    }

    public List<FileData> selectWithSameFolderId(String folderId) {

        return tableMap().values()
                         .stream()
                         .filter(data -> data.folderId()
                                             .equals(folderId))
                         .collect(Collectors.toList());
    }

}

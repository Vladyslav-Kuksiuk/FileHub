package com.teamdev.filehub.file;

import com.teamdev.filehub.InMemoryDatabaseTable;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * {@link InMemoryDatabaseTable} implementation to store {@link FileData}.
 */
public class FileTable extends InMemoryDatabaseTable<String, FileData> {

    public FileTable(@Nonnull String filePath) {
        super(filePath, FileData[].class);
    }

    public List<FileData> selectWithSameFolderId(String folderId) {

        return tableMap().values()
                .stream()
                .filter(data -> data.folderId()
                                    .equals(folderId))
                .collect(Collectors.toList());
    }

    public List<FileData> getByFolderIdAndNamePart(@Nonnull String folderId,
                                                   @Nonnull String namePart) {

        return tableMap().values()
                .stream()
                .filter(data -> Objects.equals(folderId, data.folderId()) &&
                        data.name()
                            .contains(namePart))
                .collect(Collectors.toList());
    }

}

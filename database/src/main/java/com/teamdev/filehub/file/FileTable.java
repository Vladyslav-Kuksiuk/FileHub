package com.teamdev.filehub.file;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.InMemoryDatabaseTable;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * {@link InMemoryDatabaseTable} implementation to work with {@link FileData}.
 */
public class FileTable extends InMemoryDatabaseTable<FileData> {

    public FileTable(@Nonnull String filePath) {
        super(Preconditions.checkNotNull(filePath),
              FileData[].class);
    }

    public List<FileData> getByFolderId(@Nonnull String folderId) {
        Preconditions.checkNotNull(folderId);

        return tableMap().values()
                .stream()
                .filter(data -> data.folderId()
                                    .equals(folderId))
                .collect(Collectors.toList());
    }

    public List<FileData> getByFolderIdAndNamePart(@Nonnull String folderId,
                                                   @Nonnull String namePart) {
        Preconditions.checkNotNull(folderId);
        Preconditions.checkNotNull(namePart);

        return tableMap().values()
                .stream()
                .filter(data -> Objects.equals(folderId, data.folderId()) &&
                        data.name()
                            .toLowerCase()
                            .contains(namePart.toLowerCase()))
                .collect(Collectors.toList());
    }

}

package com.teamdev.filehub.folder;

import com.teamdev.filehub.InMemoryDatabaseTable;
import com.teamdev.filehub.user.UserData;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
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
                .filter(data -> parentId.equals(data.parentFolderId()))
                .collect(Collectors.toList());
    }

    /**
     * Method to get users root folder by user id.
     *
     * @param userId
     *         User id.
     * @return {@link UserData}.
     */
    public Optional<FolderData> findUserRootFolder(@Nonnull String userId) {

        return tableMap().values()
                .stream()
                .filter(folder -> folder.ownerId()
                                        .equals(userId) && folder.parentFolderId() == null)
                .findFirst();

    }

    public List<FolderData> getByParentIdAndNamePart(@Nonnull String parentId,
                                                     @Nonnull String namePart) {

        if (!tableMap().containsKey(parentId)) {
            throw new RuntimeException("Folder with this id doesn't exist.");
        }

        return tableMap().values()
                .stream()
                .filter(data -> Objects.equals(parentId, data.parentFolderId()) &&
                        data.name()
                            .toLowerCase()
                            .contains(namePart))
                .collect(Collectors.toList());

    }

}

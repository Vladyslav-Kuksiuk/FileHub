package com.teamdev.filehub.folder;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.InMemoryDatabaseTable;
import com.teamdev.filehub.user.UserData;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * {@link InMemoryDatabaseTable} implementation to store {@link FolderData}.
 */
public class FolderTable extends InMemoryDatabaseTable<FolderData> {

    public FolderTable(@Nonnull String filePath) {
        super(filePath, FolderData[].class);
    }

    public List<FolderData> getByParentId(@Nonnull String parentId) {
        Preconditions.checkNotNull(parentId);

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
        Preconditions.checkNotNull(userId);

        return tableMap().values()
                .stream()
                .filter(folder -> folder.ownerId()
                                        .equals(userId) && folder.parentFolderId() == null)
                .findFirst();

    }

    public List<FolderData> getByParentIdAndNamePart(@Nonnull String parentId,
                                                     @Nonnull String namePart) {
        Preconditions.checkNotNull(parentId);
        Preconditions.checkNotNull(namePart);

        return tableMap().values()
                .stream()
                .filter(data -> Objects.equals(parentId, data.parentFolderId()) &&
                        data.name()
                            .toLowerCase()
                            .contains(namePart))
                .collect(Collectors.toList());

    }

}

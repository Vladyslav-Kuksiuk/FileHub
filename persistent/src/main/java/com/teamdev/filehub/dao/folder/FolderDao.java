package com.teamdev.filehub.dao.folder;

import com.teamdev.filehub.dao.DataAccessObject;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Optional;

/**
 * {@link DataAccessObject} which is intended to work with folders.
 */
public interface FolderDao extends DataAccessObject<FolderRecord> {

    /**
     * Returns list of {@link FolderRecord} with same parent id.
     *
     * @param parentId
     *         The folder's parent id.
     * @return list of {@link FolderRecord} with same parent id.
     */
    List<FolderRecord> getByParentId(@Nonnull RecordId parentId);

    /**
     * Finds user's root {@link FolderRecord} by user id.
     *
     * @param userId
     *         The user's id.
     * @return Optional founded user's root {@link FolderRecord}.
     */
    Optional<FolderRecord> findUserRootFolder(@Nonnull RecordId userId);

    /**
     * Returns list of {@link FolderRecord} with same parent id and name part.
     *
     * @param parentId
     *         The folder's parent id.
     * @param namePart
     *         The part of folder's name.
     * @return list of {@link FolderRecord} with same parent id and name part.
     */
    List<FolderRecord> getByParentIdAndNamePart(@Nonnull RecordId parentId,
                                                @Nonnull String namePart);
}

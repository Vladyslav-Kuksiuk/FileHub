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

    List<FolderRecord> getByParentId(@Nonnull RecordId parentId);

    Optional<FolderRecord> findUserRootFolder(@Nonnull RecordId userId);

    List<FolderRecord> getByParentIdAndNamePart(@Nonnull RecordId parentId,
                                                @Nonnull String namePart);
}

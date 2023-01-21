package com.teamdev.filehub.dao.folder;

import com.teamdev.filehub.dao.DataAccessObject;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Optional;

/**
 * {@link DataAccessObject} which is intended to work with folders.
 */
public interface FolderDao extends DataAccessObject<String, FolderRecord> {

    List<FolderRecord> getInnerFoldersByParentId(@Nonnull RecordId<String> parentId);

    Optional<FolderRecord> findUserRootFolder(@Nonnull RecordId<String> userId);

    List<FolderRecord> getByParentIdAndNamePart(@Nonnull RecordId<String> parentId,
                                                @Nonnull String namePart);
}

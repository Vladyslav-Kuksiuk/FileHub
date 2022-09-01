package com.teamdev.filehub.dao.folder;

import com.teamdev.filehub.dao.DataAccessObject;
import com.teamdev.filehub.dao.RecordId;

import java.util.List;

/**
 * {@link DataAccessObject} which is intended to work with folders.
 */
public interface FolderDao extends DataAccessObject<String, FolderRecord> {

    List<FolderRecord> getInnerFoldersByParentId(RecordId<String> parentId);

}

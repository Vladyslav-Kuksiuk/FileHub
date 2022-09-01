package com.teamdev.persistent.dao.folder;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.DataAccessObject;
import com.teamdev.persistent.dao.RecordId;

import java.util.List;

/**
 * {@link DataAccessObject} which is intended to work with folders.
 */
public interface FolderDao extends DataAccessObject<String, FolderRecord> {

    List<FolderRecord> getInnerFoldersByParentId(RecordId<String> parentId) throws
                                                                            DataAccessException;

}

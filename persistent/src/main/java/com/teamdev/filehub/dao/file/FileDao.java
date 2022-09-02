package com.teamdev.filehub.dao.file;

import com.teamdev.filehub.dao.DataAccessObject;
import com.teamdev.filehub.dao.RecordId;

import java.util.List;

/**
 * {@link DataAccessObject} which is intended to work with file meta context.
 */
public interface FileDao extends DataAccessObject<String, FileRecord> {

    List<FileRecord> getFilesInFolder(RecordId<String> folderId);

}

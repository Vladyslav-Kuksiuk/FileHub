package com.teamdev.filehub.dao.file;

import com.teamdev.filehub.dao.DataAccessObject;
import com.teamdev.filehub.dao.RecordId;

import java.util.List;

/**
 * {@link DataAccessObject} which is intended to work with file meta context.
 */
public interface FileDao extends DataAccessObject<FileRecord> {

    /**
     * Returns list of {@link FileRecord} with same folder id.
     *
     * @param folderId
     *         The file's folder id.
     * @return list of {@link FileRecord} with same folder id.
     */
    List<FileRecord> getByFolderId(RecordId folderId);

    /**
     * Returns list of {@link FileRecord} with same folder id and name part.
     *
     * @param folderId
     *         The file's folder id.
     * @param namePart
     *         The part of folder's name.
     * @return list of {@link FileRecord} with same folder id and name part.
     */
    List<FileRecord> getByFolderIdAndNamePart(RecordId folderId, String namePart);

}

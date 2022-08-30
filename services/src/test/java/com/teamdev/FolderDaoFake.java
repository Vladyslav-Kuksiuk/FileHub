package com.teamdev;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.folder.FolderDao;
import com.teamdev.persistent.dao.folder.FolderRecord;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class FolderDaoFake implements FolderDao {

    Map<RecordId<String>, FolderRecord> folders = new HashMap();

    @Override
    public FolderRecord find(RecordId<String> id) throws DataAccessException {

        if (!folders.containsKey(id)) {
            throw new DataAccessException("Folder with this id doesn't exist");
        }

        return folders.get(id);
    }

    @Override
    public void delete(RecordId<String> id) throws DataAccessException {

        if (!folders.containsKey(id)) {
            throw new DataAccessException("Folder with this id doesn't exist");
        }

        folders.remove(id);

    }

    @Override
    public void create(FolderRecord record) throws DataAccessException {

        if (folders.containsKey(record.id())) {
            throw new DataAccessException("Folder with this id already exists");
        }

        folders.put(record.id(), record);

    }

    @Override
    public void update(FolderRecord record) throws DataAccessException {

        if (!folders.containsKey(record.id())) {
            throw new DataAccessException("Folder with this id doesn't exist");
        }

        folders.put(record.id(), record);

    }

    @Override
    public List<FolderRecord> getInnerFoldersByParentId(RecordId<String> parentId) throws
                                                                                   DataAccessException {

        if (!folders.containsKey(parentId)) {
            throw new DataAccessException("Folder with this id doesn't exist");
        }

        return folders.values()
                      .stream()
                      .filter(record -> record.parentFolderId()
                                              .equals(parentId))
                      .collect(Collectors.toList());
    }

    public Map<RecordId<String>, FolderRecord> foldersMap() {
        return folders;
    }
}

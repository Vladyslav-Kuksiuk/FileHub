package com.teamdev.filehub;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class FolderDaoFake implements FolderDao {

    Map<RecordId<String>, FolderRecord> folders = new HashMap();

    @Override
    public Optional<FolderRecord> find(RecordId<String> id) {

        return Optional.ofNullable(folders.get(id));
    }

    @Override
    public void delete(RecordId<String> id) {

        if (!folders.containsKey(id)) {
            throw new RuntimeException("Folder with this id doesn't exist");
        }

        folders.remove(id);

    }

    @Override
    public void create(FolderRecord record) {

        if (folders.containsKey(record.id())) {
            throw new RuntimeException("Folder with this id already exists");
        }

        folders.put(record.id(), record);

    }

    @Override
    public void update(FolderRecord record) {

        if (!folders.containsKey(record.id())) {
            throw new RuntimeException("Folder with this id doesn't exist");
        }

        folders.put(record.id(), record);

    }

    @Override
    public List<FolderRecord> getInnerFoldersByParentId(RecordId<String> parentId) {

        if (!folders.containsKey(parentId)) {
            throw new RuntimeException("Folder with this id doesn't exist");
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

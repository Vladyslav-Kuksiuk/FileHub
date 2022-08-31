package com.teamdev;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.file.FileDao;
import com.teamdev.persistent.dao.file.FileRecord;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class FileDaoFake implements FileDao {

    Map<RecordId<String>, FileRecord> files = new HashMap();

    @Override
    public FileRecord find(RecordId<String> id) throws DataAccessException {

        if (!files.containsKey(id)) {
            throw new DataAccessException("File with this id doesn't exist");
        }

        return files.get(id);
    }

    @Override
    public void delete(RecordId<String> id) throws DataAccessException {

        if (!files.containsKey(id)) {
            throw new DataAccessException("File with this id doesn't exist");
        }

        files.remove(id);

    }

    @Override
    public void create(FileRecord record) throws DataAccessException {

        if (files.containsKey(record.id())) {
            throw new DataAccessException("File with this id already exists");
        }

        files.put(record.id(), record);

    }

    @Override
    public void update(FileRecord record) throws DataAccessException {

        if (!files.containsKey(record.id())) {
            throw new DataAccessException("File with this id doesn't exist");
        }

        files.put(record.id(), record);

    }

    @Override
    public List<FileRecord> getFilesInFolder(RecordId<String> folderId) {
        return files.values()
                    .stream()
                    .filter(record -> record.folderId()
                                            .equals(folderId))
                    .collect(Collectors.toList());
    }
}

package com.teamdev.filehub;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class FileDaoFake implements FileDao {

    Map<RecordId<String>, FileRecord> files = new HashMap();

    @Override
    public Optional<FileRecord> find(RecordId<String> id) {

        return Optional.ofNullable(files.get(id));
    }

    @Override
    public void delete(RecordId<String> id) {

        if (!files.containsKey(id)) {
            throw new RuntimeException("File with this id doesn't exist");
        }

        files.remove(id);

    }

    @Override
    public void create(FileRecord record) {

        if (files.containsKey(record.id())) {
            throw new RuntimeException("File with this id already exists");
        }

        files.put(record.id(), record);

    }

    @Override
    public void update(FileRecord record) {

        if (!files.containsKey(record.id())) {
            throw new RuntimeException("File with this id doesn't exist");
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

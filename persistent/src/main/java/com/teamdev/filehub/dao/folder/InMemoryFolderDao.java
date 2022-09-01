package com.teamdev.filehub.dao.folder;

import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.folder.FolderData;
import com.teamdev.filehub.folder.FolderTable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * {@link FolderDao} implementation which is intended to work with folder
 * in {@link InMemoryDatabase}.
 */
public class InMemoryFolderDao implements FolderDao {

    private final FolderTable folderTable;

    public InMemoryFolderDao(FolderTable folderTable) {
        this.folderTable = folderTable;
    }

    @Override
    public Optional<FolderRecord> find(RecordId<String> id) {

        Optional<FolderData> optionalData = folderTable.getDataById(id.value());

        if (optionalData.isPresent()) {

            FolderData data = optionalData.get();

            return Optional.of(new FolderRecord(id,
                                                new RecordId<>(data.ownerId()),
                                                new RecordId<>(data.parentFolderId()),
                                                data.name()));
        }

        return Optional.empty();
    }

    @Override
    public void delete(RecordId<String> id) {
        folderTable.deleteData(id.value());
    }

    @Override
    public void create(FolderRecord record) {

        FolderData data = new FolderData(
                record.id()
                      .value(),
                record.ownerId()
                      .value(),
                record.parentFolderId()
                      .value(),
                record.name());

        folderTable.addData(data);

    }

    @Override
    public void update(FolderRecord record) {
        FolderData data = new FolderData(
                record.id()
                      .value(),
                record.ownerId()
                      .value(),
                record.parentFolderId()
                      .value(),
                record.name());

        folderTable.updateData(data);
    }

    @Override
    public List<FolderRecord> getInnerFoldersByParentId(RecordId<String> parentId) {

        return folderTable.selectWithSameParentId(parentId.value())
                          .stream()
                          .map(data -> new FolderRecord(new RecordId<>(data.id()),
                                                        new RecordId<>(data.ownerId()),
                                                        new RecordId<>(data.parentFolderId()),
                                                        data.name()))
                          .collect(Collectors.toList());

    }
}

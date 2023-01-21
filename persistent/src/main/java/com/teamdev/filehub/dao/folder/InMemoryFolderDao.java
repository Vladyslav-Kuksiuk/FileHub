package com.teamdev.filehub.dao.folder;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.folder.FolderData;
import com.teamdev.filehub.folder.FolderTable;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * {@link FolderDao} implementation which is intended to work with folder
 * in {@link InMemoryDatabase}.
 */
public class InMemoryFolderDao implements FolderDao {

    private final FolderTable folderTable;

    public InMemoryFolderDao(@Nonnull FolderTable folderTable) {
        this.folderTable = Preconditions.checkNotNull(folderTable);
    }

    private static FolderRecord convertDataIntoRecord(FolderData data) {
        return new FolderRecord(new RecordId(data.id()),
                                new RecordId(data.ownerId()),
                                new RecordId(data.parentFolderId()),
                                data.name());
    }

    private static FolderData convertRecordIntoData(@Nonnull FolderRecord record) {
        Preconditions.checkNotNull(record);

        return new FolderData(
                record.id()
                      .value(),
                record.ownerId()
                      .value(),
                record.parentFolderId()
                      .value(),
                record.name());
    }

    @Override
    public Optional<FolderRecord> find(@Nonnull RecordId id) {
        Preconditions.checkNotNull(id);

        Optional<FolderData> optionalData = folderTable.findById(id.value());

        if (optionalData.isPresent()) {

            FolderData data = optionalData.get();

            return Optional.of(convertDataIntoRecord(data));
        }

        return Optional.empty();
    }

    @Override
    public void delete(@Nonnull RecordId id) {
        Preconditions.checkNotNull(id);

        folderTable.delete(id.value());
    }

    @Override
    public void create(@Nonnull FolderRecord record) {
        Preconditions.checkNotNull(record);

        folderTable.create(convertRecordIntoData(record));

    }

    @Override
    public void update(@Nonnull FolderRecord record) {
        Preconditions.checkNotNull(record);

        folderTable.update(convertRecordIntoData(record));
    }

    @Override
    public List<FolderRecord> getByParentId(@Nonnull RecordId parentId) {
        Preconditions.checkNotNull(parentId);

        return folderTable.getByParentId(parentId.value())
                .stream()
                .map(InMemoryFolderDao::convertDataIntoRecord)
                .collect(Collectors.toList());

    }

    @Override
    public Optional<FolderRecord> findUserRootFolder(@Nonnull RecordId userId) {
        Preconditions.checkNotNull(userId);

        Optional<FolderData> optionalData = folderTable.findUserRootFolder(userId.value());

        if (optionalData.isPresent()) {

            FolderData data = optionalData.get();

            return Optional.of(convertDataIntoRecord(data));
        }

        return Optional.empty();
    }

    @Override
    public List<FolderRecord> getByParentIdAndNamePart(@Nonnull RecordId parentId,
                                                       @Nonnull String namePart) {
        Preconditions.checkNotNull(parentId);
        Preconditions.checkNotNull(namePart);

        return folderTable.getByParentIdAndNamePart(parentId.value(), namePart)
                .stream()
                .map(InMemoryFolderDao::convertDataIntoRecord)
                .collect(Collectors.toList());
    }
}

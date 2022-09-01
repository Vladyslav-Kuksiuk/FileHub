package com.teamdev.filehub.dao.folder;

import com.teamdev.filehub.DatabaseTransactionException;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.DataAccessException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.folder.FolderData;

import java.util.List;
import java.util.stream.Collectors;

/**
 * {@link FolderDao} implementation which is intended to work with folder
 * in {@link InMemoryDatabase}.
 */
public class InMemoryFolderDao implements FolderDao {

    private final InMemoryDatabase database;

    public InMemoryFolderDao(InMemoryDatabase database) {
        this.database = database;
    }

    @Override
    public FolderRecord find(RecordId<String> id) throws DataAccessException {

        FolderData data;
        try {
            data = database.folderTable()
                           .getDataById(id.value());
        } catch (DatabaseTransactionException e) {
            throw new DataAccessException(e.getMessage());
        }

        return new FolderRecord(id,
                                new RecordId<>(data.ownerId()),
                                new RecordId<>(data.parentFolderId()),
                                data.name());
    }

    @Override
    public void delete(RecordId<String> id) throws DataAccessException {
        try {
            database.folderTable()
                    .deleteData(id.value());
        } catch (DatabaseTransactionException e) {
            throw new DataAccessException(e.getMessage());
        }
    }

    @Override
    public void create(FolderRecord record) throws DataAccessException {

        FolderData data = new FolderData(
                record.id()
                      .value(),
                record.ownerId()
                      .value(),
                record.parentFolderId()
                      .value(),
                record.name());

        try {
            database.folderTable()
                    .addData(data);
        } catch (DatabaseTransactionException e) {
            throw new DataAccessException(e.getMessage());
        }

    }

    @Override
    public void update(FolderRecord record) throws DataAccessException {
        FolderData data = new FolderData(
                record.id()
                      .value(),
                record.ownerId()
                      .value(),
                record.parentFolderId()
                      .value(),
                record.name());

        try {
            database.folderTable()
                    .updateData(data);
        } catch (DatabaseTransactionException e) {
            throw new DataAccessException(e.getMessage());
        }
    }

    @Override
    public List<FolderRecord> getInnerFoldersByParentId(RecordId<String> parentId) throws
                                                                                   DataAccessException {

        List<FolderRecord> folders = null;
        try {
            folders = database.folderTable()
                              .selectWithSameParentId(parentId.value())
                              .stream()
                              .map(data -> new FolderRecord(new RecordId<>(data.id()),
                                                            new RecordId<>(data.ownerId()),
                                                            new RecordId<>(data.parentFolderId()),
                                                            data.name()))
                              .collect(Collectors.toList());
        } catch (DatabaseTransactionException e) {
            throw new DataAccessException(e.getMessage());
        }

        return folders;
    }
}

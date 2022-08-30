package com.teamdev.persistent.dao.folder;

import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.folder.FolderData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;

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
}

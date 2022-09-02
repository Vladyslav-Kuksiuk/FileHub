package com.teamdev.filehub.dao.folder;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.folder.FolderData;
import com.teamdev.filehub.folder.FolderTable;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

class InMemoryFolderDaoTest {

    private final FolderRecord FOLDER_RECORD = new FolderRecord(new RecordId<>("folder_id"),
                                                                new RecordId<>("owner_id"),
                                                                new RecordId<>("parent_folder_id"),
                                                                "name");
    private final FolderData FOLDER_DATA = new FolderData("folder_id",
                                                          "owner_id",
                                                          "parent_folder_id",
                                                          "name");
    @Mock
    private FolderTable folderTable;
    private FolderDao folderDao;

    public InMemoryFolderDaoTest() {
        MockitoAnnotations.openMocks(this);
        folderDao = new InMemoryFolderDao(folderTable);
    }

    @Test
    void findTest() {

        given(folderTable.findById(FOLDER_RECORD.id()
                                                .value()))
                .willReturn(Optional.of(FOLDER_DATA));

        assertWithMessage("Find folder by id failed.")
                .that(folderDao.find(FOLDER_RECORD.id())
                               .get()
                               .name())
                .isEqualTo(FOLDER_RECORD.name());

    }

    @Test
    void findAbsentFolderTest() {

        given(folderTable.findById(FOLDER_RECORD.id()
                                                .value()))
                .willReturn(Optional.empty());

        assertWithMessage("Find absent folder by id failed.")
                .that(folderDao.find(FOLDER_RECORD.id())
                               .isEmpty())
                .isTrue();

    }

    @Test
    void createTest() {

        folderDao.create(FOLDER_RECORD);

        verify(folderTable).create(FOLDER_DATA);

    }

    @Test
    void createExistingFolderTest() {

        doThrow(new RuntimeException("Data already exists.")).when(folderTable)
                                                             .create(FOLDER_DATA);

        assertThrows(RuntimeException.class, () -> folderDao.create(FOLDER_RECORD));

    }

    @Test
    void updateTest() {

        folderDao.update(FOLDER_RECORD);

        verify(folderTable).update(FOLDER_DATA);

    }

    @Test
    void updateAbsentFolderTest() {

        doThrow(new RuntimeException("Data doesn't exist.")).when(folderTable)
                                                            .update(FOLDER_DATA);

        assertThrows(RuntimeException.class, () -> folderDao.update(FOLDER_RECORD));

    }

    @Test
    void deleteTest() {

        folderDao.delete(FOLDER_RECORD.id());

        verify(folderTable).delete(FOLDER_DATA.id());

    }

    @Test
    void deleteAbsentFolderTest() {

        doThrow(new RuntimeException("Data doesn't exist.")).when(folderTable)
                                                            .delete(FOLDER_DATA.id());

        assertThrows(RuntimeException.class, () -> folderDao.delete(FOLDER_RECORD.id()));

    }

}
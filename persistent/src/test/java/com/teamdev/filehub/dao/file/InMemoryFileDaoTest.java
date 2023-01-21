package com.teamdev.filehub.dao.file;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.file.FileData;
import com.teamdev.filehub.file.FileTable;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

class InMemoryFileDaoTest {

    private final FileRecord FILE_RECORD = new FileRecord(new RecordId("file_id"),
                                                          new RecordId("folder_id"),
                                                          new RecordId("owner_id"),
                                                          "name",
                                                          "extension",
                                                          123);
    private final FileData FILE_DATA = new FileData("file_id",
                                                    "folder_id",
                                                    "owner_id",
                                                    "name",
                                                    "extension",
                                                    123);
    @Mock
    private FileTable fileTable;
    private FileDao fileDao;

    public InMemoryFileDaoTest() {
        MockitoAnnotations.openMocks(this);
        fileDao = new InMemoryFileDao(fileTable);
    }

    @Test
    void findTest() {

        given(fileTable.findById(FILE_RECORD.id()
                                            .value()))
                .willReturn(Optional.of(FILE_DATA));

        assertWithMessage("Find file by id failed.")
                .that(fileDao.find(FILE_RECORD.id())
                             .get()
                             .name())
                .isEqualTo(FILE_RECORD.name());

    }

    @Test
    void findAbsentFileTest() {

        given(fileTable.findById(FILE_RECORD.id()
                                            .value()))
                .willReturn(Optional.empty());

        assertWithMessage("Find absent file by id failed.")
                .that(fileDao.find(FILE_RECORD.id())
                             .isEmpty())
                .isTrue();

    }

    @Test
    void createTest() {

        fileDao.create(FILE_RECORD);

        verify(fileTable).create(FILE_DATA);

    }

    @Test
    void createExistingFileTest() {

        doThrow(new RuntimeException("Data already exists.")).when(fileTable)
                .create(FILE_DATA);

        assertThrows(RuntimeException.class, () -> fileDao.create(FILE_RECORD));

    }

    @Test
    void updateTest() {

        fileDao.update(FILE_RECORD);

        verify(fileTable).update(FILE_DATA);

    }

    @Test
    void updateAbsentFileTest() {

        doThrow(new RuntimeException("Data doesn't exist.")).when(fileTable)
                                                            .update(FILE_DATA);

        assertThrows(RuntimeException.class, () -> fileDao.update(FILE_RECORD));

    }

    @Test
    void deleteTest() {

        fileDao.delete(FILE_RECORD.id());

        verify(fileTable).delete(FILE_DATA.id());

    }

    @Test
    void deleteAbsentFileTest() {

        doThrow(new RuntimeException("Data doesn't exist.")).when(fileTable)
                                                            .delete(FILE_DATA.id());

        assertThrows(RuntimeException.class, () -> fileDao.delete(FILE_RECORD.id()));

    }

}

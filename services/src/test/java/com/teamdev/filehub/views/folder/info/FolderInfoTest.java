package com.teamdev.filehub.views.folder.info;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.views.folder.content.FolderContentQuery;
import com.teamdev.filehub.views.folder.content.FolderContentViewImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

class FolderInfoTest {

    @Test
    @DisplayName("Constructor NullPointer test")
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(FolderInfo.class);

    }

    @Test
    @DisplayName("Should return FolderInfo")
    void testHandleWithoutExceptions()
            throws DataNotFoundException, AccessDeniedException {

        var folderRecord = new FolderRecord(new RecordId("folderId"),
                                            new RecordId("userId"),
                                            new RecordId(null),
                                            "folder");

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderRecord.id()))
               .thenReturn(Optional.of(folderRecord));

        var query = new FolderInfoQuery(folderRecord.ownerId(),
                                        folderRecord.id());

        var view = new FolderInfoViewImpl(folderDao);

        var folderInfo = view.handle(query);

        assertWithMessage("FolderInfo id not equal to FolderRecord id")
                .that(folderInfo.id())
                .isEqualTo(folderRecord.id()
                                       .value());

        assertWithMessage("FolderInfo parentId not equal to FolderRecord parentId")
                .that(folderInfo.parentId())
                .isEqualTo(folderRecord.parentFolderId()
                                       .value());

    }

    @Test
    @DisplayName("Should throw a DataNotFoundException when folder not found")
    void testHandleWithDataNotFoundException() {

        var folderId = new RecordId("folderId");

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderId))
               .thenReturn(Optional.empty());

        var fileDao = Mockito.mock(FileDao.class);

        var query = new FolderContentQuery(new RecordId("userId"),
                                           folderId);

        var view = new FolderContentViewImpl(folderDao, fileDao);

        assertThrows(DataNotFoundException.class, () -> {
            view.handle(query);
        }, "DataNotFoundException not thrown.");
    }

    @Test
    @DisplayName("Should throw an AccessDeniedException when user is not the owner")
    void testHandleWithAccessDeniedException() {

        var folderRecord = new FolderRecord(new RecordId("folderId"),
                                            new RecordId("userId"),
                                            new RecordId(null),
                                            "folder");

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderRecord.id()))
               .thenReturn(Optional.of(folderRecord));

        var fileDao = Mockito.mock(FileDao.class);

        var query = new FolderContentQuery(new RecordId("NotOwnerUser"),
                                           folderRecord.id());

        var view = new FolderContentViewImpl(folderDao, fileDao);

        assertThrows(AccessDeniedException.class, () -> {
            view.handle(query);
        }, "AccessDeniedException not thrown.");
    }

}

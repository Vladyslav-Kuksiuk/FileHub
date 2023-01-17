package com.teamdev.filehub.views.folder.content;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.views.folder.FileItem;
import com.teamdev.filehub.views.folder.FolderContent;
import com.teamdev.filehub.views.folder.FolderItem;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class FolderContentViewImplTest {

    @Test
    @DisplayName("Constructor NullPointer test")
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(FolderContentViewImpl.class);

    }

    @Test
    @DisplayName("Should return FolderContent")
    void testHandleWithoutExceptions()
            throws DataNotFoundException, AccessDeniedException {

        var folderRecord = new FolderRecord(new RecordId<>("folderId"),
                                            new RecordId<>("userId"),
                                            new RecordId<>(null),
                                            "folder");

        var innerFolderList = List.of(
                new FolderRecord(
                        new RecordId<>("innerFolderId1"),
                        folderRecord.ownerId(),
                        folderRecord.id(),
                        "innerFolder1"
                ),
                new FolderRecord(
                        new RecordId<>("innerFolderId2"),
                        folderRecord.ownerId(),
                        folderRecord.id(),
                        "innerFolder1"
                ));

        var fileList = List.of(
                new FileRecord(
                        new RecordId<>("fileId1"),
                        folderRecord.id(),
                        folderRecord.ownerId(),
                        "file1",
                        "txt"
                ),
                new FileRecord(
                        new RecordId<>("fileId2"),
                        folderRecord.id(),
                        folderRecord.ownerId(),
                        "file2",
                        "pdf"
                ));

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderRecord.id()))
               .thenReturn(Optional.of(folderRecord));
        Mockito.when(folderDao.getInnerFoldersByParentId(folderRecord.id()))
               .thenReturn(innerFolderList);

        var fileDao = Mockito.mock(FileDao.class);
        Mockito.when(fileDao.getFilesInFolder(folderRecord.id()))
               .thenReturn(fileList);

        var query = new FolderContentQuery(folderRecord.ownerId(),
                                           folderRecord.id());

        var view = new FolderContentViewImpl(folderDao, fileDao);

        var folderContent = view.handle(query);

        var expectedFolderContent = new FolderContent();

        innerFolderList.forEach(folder -> expectedFolderContent.addItem(
                new FolderItem(folder.id()
                                     .value(),
                               folder.parentFolderId()
                                     .value(),
                               folder.name())));

        fileList.forEach(file -> expectedFolderContent.addItem(
                new FileItem(file.id()
                                 .value(),
                             file.folderId()
                                 .value(),
                             file.name(),
                             1,
                             file.extension())));

        assertThat(folderContent.items())
                .isEqualTo(expectedFolderContent.items());

    }

    @Test
    @DisplayName("Should throw a DataNotFoundException when folder not found")
    void testHandleWithDataNotFoundException() {

        var folderId = new RecordId<>("folderId");

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderId))
               .thenReturn(Optional.empty());

        var fileDao = Mockito.mock(FileDao.class);

        var query = new FolderContentQuery(new RecordId<>("userId"),
                                           folderId);

        var view = new FolderContentViewImpl(folderDao, fileDao);

        assertThrows(DataNotFoundException.class, () -> {
            view.handle(query);
        }, "DataNotFoundException not thrown.");
    }

    @Test
    @DisplayName("Should throw an AccessDeniedException when user is not the owner")
    void testHandleWithAccessDeniedException() {

        var folderRecord = new FolderRecord(new RecordId<>("folderId"),
                                            new RecordId<>("userId"),
                                            new RecordId<>(null),
                                            "folder");

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderRecord.id()))
               .thenReturn(Optional.of(folderRecord));

        var fileDao = Mockito.mock(FileDao.class);

        var query = new FolderContentQuery(new RecordId<>("NotOwnerUser"),
                                           folderRecord.id());

        var view = new FolderContentViewImpl(folderDao, fileDao);

        assertThrows(AccessDeniedException.class, () -> {
            view.handle(query);
        }, "AccessDeniedException not thrown.");
    }

}

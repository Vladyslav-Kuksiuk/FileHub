package com.teamdev.filehub.views.folder.search;

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
import com.teamdev.filehub.views.folder.content.FolderContentViewImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class FolderSearchViewImplTest {

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

        var folderRecord = new FolderRecord(new RecordId("folderId"),
                                            new RecordId("userId"),
                                            new RecordId(null),
                                            "folder");

        var searchWord = "name";

        var innerFolderList = List.of(
                new FolderRecord(
                        new RecordId("innerFolderId1"),
                        folderRecord.ownerId(),
                        folderRecord.id(),
                        "innerFolderName1"
                ),
                new FolderRecord(
                        new RecordId("innerFolderId2"),
                        folderRecord.ownerId(),
                        folderRecord.id(),
                        "innerFolderName2"
                ));

        var fileList = List.of(
                new FileRecord(
                        new RecordId("fileId1"),
                        folderRecord.id(),
                        folderRecord.ownerId(),
                        "fileName1",
                        "txt",
                        123123
                ),
                new FileRecord(
                        new RecordId("fileId2"),
                        folderRecord.id(),
                        folderRecord.ownerId(),
                        "fileName2",
                        "pdf",
                        123123
                ));

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderRecord.id()))
               .thenReturn(Optional.of(folderRecord));
        Mockito.when(folderDao.getByParentIdAndNamePart(folderRecord.id(), searchWord))
               .thenReturn(innerFolderList);

        var fileDao = Mockito.mock(FileDao.class);
        Mockito.when(fileDao.getByFolderIdAndNamePart(folderRecord.id(), searchWord))
               .thenReturn(fileList);

        var query = new FolderSearchQuery(folderRecord.ownerId(),
                                          folderRecord.id(),
                                          searchWord);

        var view = new FolderSearchViewImpl(folderDao, fileDao);

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
                             file.size(),
                             file.mimetype())));

        assertThat(folderContent.items())
                .isEqualTo(expectedFolderContent.items());

    }

    @Test
    @DisplayName("Should throw DataNotFoundException because folder to search in not found")
    void testHandleWithDataNotFoundException() {

        var folderId = new RecordId("folderId");

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderId))
               .thenReturn(Optional.empty());

        var fileDao = Mockito.mock(FileDao.class);

        var view = new FolderSearchViewImpl(folderDao, fileDao);

        var query = new FolderSearchQuery(new RecordId("userid"),
                                          folderId,
                                          "searchWord");

        assertThrows(DataNotFoundException.class, () -> {
            view.handle(query);
        });

    }

    @Test
    @DisplayName("Should throw AccessDeniedException because user not owner")
    void testHandleWithAccessDeniedException() {

        var folderRecord = new FolderRecord(
                new RecordId("folderId"),
                new RecordId("userId"),
                new RecordId("parentFolderId"),
                "name"
        );

        var folderDao = Mockito.mock(FolderDao.class);
        Mockito.when(folderDao.find(folderRecord.id()))
               .thenReturn(Optional.of(folderRecord));

        var fileDao = Mockito.mock(FileDao.class);

        var view = new FolderSearchViewImpl(folderDao, fileDao);

        var query = new FolderSearchQuery(new RecordId("notOwnerUser"),
                                          folderRecord.id(),
                                          "searchWord");

        assertThrows(AccessDeniedException.class, () -> {
            view.handle(query);
        });

    }

}

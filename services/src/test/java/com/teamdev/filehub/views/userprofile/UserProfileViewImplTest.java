package com.teamdev.filehub.views.userprofile;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.dao.user.UserRecord;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static com.google.common.truth.Truth.assertWithMessage;
import static com.teamdev.util.StringEncryptor.encrypt;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class UserProfileViewImplTest {

    @Test
    @DisplayName("Should return user profile")
    void shouldReturnUserProfile() {
        UserRecord userRecord = new UserRecord(
                new RecordId("userId"),
                "login",
                "password",
                true,
                encrypt("login"));

        FolderRecord folderRecord = new FolderRecord(
                new RecordId("folderId"),
                userRecord.id(),
                new RecordId(null),
                "Folder");

        RecordId folderId = new RecordId("folderId");

        UserDao userDao = Mockito.mock(UserDao.class);
        FolderDao folderDao = Mockito.mock(FolderDao.class);
        UserProfileQuery userProfileQuery = Mockito.mock(UserProfileQuery.class);

        UserProfileView userProfileView = new UserProfileViewImpl(userDao, folderDao);

        Mockito.when(userProfileQuery.userId())
               .thenReturn(userRecord.id());

        Mockito.when(userDao.find(userRecord.id()))
               .thenReturn(Optional.of(userRecord));

        Mockito.when(folderDao.findUserRootFolder(userRecord.id()))
               .thenReturn(Optional.of(folderRecord));

        UserProfile userProfile = userProfileView.handle(userProfileQuery);

        assertWithMessage("UserProfileView failed in login")
                .that(userProfile.username())
                .isEqualTo(userRecord.login());

        assertWithMessage("UserProfileView failed in rootFolderId")
                .that(userProfile.rootFolderId())
                .isEqualTo(folderRecord.id()
                                       .value());

    }

    @Test
    @DisplayName("Should throw an exception if there is no user")
    void shouldThrowExceptionWithoutUser() {
        RecordId userId = new RecordId("userId");

        RecordId folderId = new RecordId("folderId");

        UserDao userDao = Mockito.mock(UserDao.class);
        FolderDao folderDao = Mockito.mock(FolderDao.class);
        UserProfileQuery userProfileQuery = Mockito.mock(UserProfileQuery.class);

        UserProfileView userProfileView = new UserProfileViewImpl(userDao, folderDao);

        Mockito.when(userProfileQuery.userId())
               .thenReturn(userId);

        Mockito.when(userDao.find(userId))
               .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            userProfileView.handle(userProfileQuery);
        }, "UserProfileView passed without UserRecord");
    }

    @Test
    @DisplayName("Should throw an exception if there is no root folder")
    void shouldThrowExceptionWithoutRootFolder() {
        UserRecord userRecord = new UserRecord(
                new RecordId("userId"),
                "login",
                "password",
                true,
                encrypt("login"));

        RecordId folderId = new RecordId("folderId");

        UserDao userDao = Mockito.mock(UserDao.class);
        FolderDao folderDao = Mockito.mock(FolderDao.class);
        UserProfileQuery userProfileQuery = Mockito.mock(UserProfileQuery.class);

        UserProfileView userProfileView = new UserProfileViewImpl(userDao, folderDao);

        Mockito.when(userProfileQuery.userId())
               .thenReturn(userRecord.id());

        Mockito.when(userDao.find(userRecord.id()))
               .thenReturn(Optional.of(userRecord));

        Mockito.when(folderDao.findUserRootFolder(userRecord.id()))
               .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            userProfileView.handle(userProfileQuery);
        }, "UserProfileView passed without FolderRecord");

    }

}

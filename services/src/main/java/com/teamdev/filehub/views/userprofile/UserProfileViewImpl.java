package com.teamdev.filehub.views.userprofile;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.dao.user.UserRecord;

import java.util.Optional;

/**
 * {@link UserProfileView} implementation.
 */
public class UserProfileViewImpl implements UserProfileView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;
    private final FolderDao folderDao;

    public UserProfileViewImpl(UserDao userDao, FolderDao folderDao) {
        this.userDao = userDao;
        this.folderDao = folderDao;
    }

    @Override
    public UserProfile handle(UserProfileQuery query) {
        logger.atInfo()
              .log("[VIEW QUERIED] - User profile - userId: %s.", query.userId()
                                                                       .value());
        Optional<UserRecord> optionalUserRecord = userDao.find(query.userId());
        if (optionalUserRecord.isEmpty()) {
            logger.atInfo()
                  .log("[VIEW FAILED] - User profile - user not found");
            throw new RuntimeException("User not found.");
        }

        Optional<FolderRecord> optionalFolderRecord = folderDao.findUserRootFolder(query.userId());
        if (optionalFolderRecord.isEmpty()) {
            logger.atInfo()
                  .log("[VIEW FAILED] - User profile - user root folder not found");
            throw new RuntimeException("User root folder not found.");
        }

        logger.atInfo()
              .log("[VIEW FINISHED] - User profile - userId: %s.", query.userId()
                                                                        .value());
        return new UserProfile(optionalUserRecord.get()
                                                 .login(), optionalFolderRecord.get()
                                                                               .id()
                                                                               .value());
    }
}

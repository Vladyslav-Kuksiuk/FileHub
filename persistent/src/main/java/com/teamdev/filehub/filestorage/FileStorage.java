package com.teamdev.filehub.filestorage;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.RecordId;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Class to work with files in file system.
 */
public class FileStorage {

    public static final String STORAGE_FOLDER_PATH =
            InMemoryDatabase.DATABASE_FOLDER_PATH + "Files\\";
    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    public FileStorage() {
        File filesDirectory = new File(STORAGE_FOLDER_PATH);
        if (!filesDirectory.exists()) {
            filesDirectory.mkdirs();
        }
    }

    /**
     * Method to save files to file system from {@link InputStream} by given path.
     *
     * @param fileInput
     *         file to save.
     */
    public void uploadFile(RecordId<String> fileId, InputStream fileInput) {

        String fullPath = STORAGE_FOLDER_PATH + fileId.value();

        File targetFile = new File(fullPath);
        if (!targetFile.exists()) {

            File folder = new File(targetFile.getParent());
            if (!folder.exists()) {
                folder.mkdirs();
            }

            try {
                targetFile.createNewFile();
            } catch (IOException exception) {
                throw new RuntimeException(exception);
            }

        }

        try (OutputStream outStream = new FileOutputStream(targetFile)) {

            byte[] buffer = new byte[8 * 1024];
            int bytesRead;
            while ((bytesRead = fileInput.read(buffer)) != -1) {
                outStream.write(buffer, 0, bytesRead);
            }
            fileInput.close();

        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }

        logger.atInfo()
              .log("[FILE WRITTEN] - Path: %s.", fullPath);

    }

    /**
     * Method to convert file in file system to {@link InputStream} by given path.
     *
     * @return {@link InputStream} from found file.
     */
    public InputStream downloadFile(RecordId<String> fileId) {
        String fullPath = STORAGE_FOLDER_PATH + fileId.value();
        File file = new File(fullPath);

        if (!file.exists()) {
            throw new RuntimeException("File reading failed.");
        }

        try {
            InputStream fileInput = new FileInputStream(file);
            return fileInput;
        } catch (FileNotFoundException exception) {
            throw new RuntimeException(exception);
        }

    }

    /**
     * Removes file by given id.
     */
    public void removeFile(RecordId<String> fileId) {
        String fullPath = STORAGE_FOLDER_PATH + fileId.value();
        File file = new File(fullPath);

        if (!file.exists()) {
            throw new RuntimeException("File not found.");
        }

        file.delete();
    }

    /**
     * Method to clean all files in root directory.
     */
    public void clean() {
        File file = new File(STORAGE_FOLDER_PATH);

        if (file.exists()) {
            file.delete();
            file.mkdirs();
        }

    }

}

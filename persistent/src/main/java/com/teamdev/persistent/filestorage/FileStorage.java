package com.teamdev.persistent.filestorage;

import com.google.common.flogger.FluentLogger;
import com.teamdev.database.InMemoryDatabase;

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
     * @param filePath
     *         path to save the file.
     * @param fileInput
     *         file to save.
     */
    public void uploadFile(String filePath, InputStream fileInput) {

        String fullPath = STORAGE_FOLDER_PATH + filePath;

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

        try (OutputStream outStream = new FileOutputStream(targetFile);) {

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
              .log("[FILE WRITTEN] - path: %s", fullPath);

    }

    /**
     * Method to convert file in file system to {@link InputStream} by given path.
     *
     * @param filePath
     *         path where file stored.
     * @return {@link InputStream} from found file.
     */
    public InputStream downloadFile(String filePath) {
        String fullPath = STORAGE_FOLDER_PATH + filePath;
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

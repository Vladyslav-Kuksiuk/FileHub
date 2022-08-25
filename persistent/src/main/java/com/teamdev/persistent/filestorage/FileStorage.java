package com.teamdev.persistent.filestorage;

import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;

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

    public static final String STORAGE_FOLDER_PATH = "C:\\Programming\\Database\\Files\\";
    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    /**
     * Method to save files to file system from {@link InputStream} by given path.
     *
     * @param filePath
     *         path to save the file.
     * @param fileInput
     *         file to save.
     * @throws DataAccessException
     *         If file cannot be written or created.
     */
    public void uploadFile(String filePath, InputStream fileInput) throws DataAccessException {

        String fullPath = STORAGE_FOLDER_PATH + filePath;

        File targetFile = new File(fullPath);
        if (!targetFile.exists()) {

            File folder = new File(targetFile.getParent());
            if (!folder.exists()) {
                folder.mkdirs();
            }

            try {
                targetFile.createNewFile();
            } catch (IOException e) {
                throw new DataAccessException("File writing failed.");
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
            throw new DataAccessException("File writing failed.");
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
     * @throws DataAccessException
     *         If file not found or cannot be read.
     */
    public InputStream downloadFile(String filePath) throws DataAccessException {
        String fullPath = STORAGE_FOLDER_PATH + filePath;
        File file = new File(fullPath);

        if (!file.exists()) {
            throw new DataAccessException("File reading failed.");
        }

        try {
            InputStream fileInput = new FileInputStream(file);
            return fileInput;
        } catch (FileNotFoundException e) {
            throw new DataAccessException("File reading failed.");
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

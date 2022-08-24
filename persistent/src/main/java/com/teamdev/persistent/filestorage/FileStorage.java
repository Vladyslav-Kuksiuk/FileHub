package com.teamdev.persistent.filestorage;

import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class FileStorage {

    public static final String STORAGE_FOLDER_PATH = "C:\\Programming\\Database\\Files\\";
    private final FluentLogger logger = FluentLogger.forEnclosingClass();

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

        logger.atInfo().log("[FILE WRITTEN] - path: %s", fullPath);

    }

}

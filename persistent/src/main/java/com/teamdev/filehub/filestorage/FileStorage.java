package com.teamdev.filehub.filestorage;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;
import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

/**
 * API to work with files in filesystem.
 */
public class FileStorage {

    private final String storageFolderPath;
    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    public FileStorage(@Nonnull String folderPath) {
        Preconditions.checkNotNull(folderPath);

        storageFolderPath = folderPath + File.separator + "FileStorage" + File.separator;

        File filesDirectory = new File(storageFolderPath);
        if (!filesDirectory.exists()) {
            filesDirectory.mkdirs();
        }
    }

    /**
     * Saves files to file system from {@link InputStream} by given id.
     *
     * @param fileInput
     *         file to save.
     */
    public long uploadFile(@Nonnull RecordId fileId,
                           @Nonnull InputStream fileInput) {
        Preconditions.checkNotNull(fileId);
        Preconditions.checkNotNull(fileInput);

        String fullPath = storageFolderPath + fileId.value() + ".zip";

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

        try (OutputStream fileOut = new FileOutputStream(targetFile);
             var zipOut = new ZipOutputStream(fileOut)) {

            ZipEntry zipEntry = new ZipEntry("value");
            zipOut.putNextEntry(zipEntry);

            byte[] buffer = new byte[8 * 1024];
            int bytesRead;
            while ((bytesRead = fileInput.read(buffer)) != -1) {
                zipOut.write(buffer, 0, bytesRead);
            }
            fileInput.close();
            zipOut.closeEntry();

        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }

        logger.atInfo()
                .log("[FILE WRITTEN] - Path: %s.", fullPath);

        return targetFile.length();
    }

    /**
     * Converts file in file system to {@link InputStream} by given id.
     *
     * @return {@link InputStream} from found file.
     */
    public InputStream downloadFile(@Nonnull RecordId fileId) {
        Preconditions.checkNotNull(fileId);

        String fullPath = storageFolderPath + fileId.value() + ".zip";
        File file = new File(fullPath);

        if (!file.exists()) {
            throw new RuntimeException("File reading failed.");
        }

        try {
            InputStream fileInput = getFileInputStreamFromZip(fullPath, "value");
            return fileInput;
        } catch (IOException exception) {
            throw new RuntimeException(exception);
        }

    }

    public static InputStream getFileInputStreamFromZip(String zipFilePath, String fileNameInZip) throws IOException {
        try (FileInputStream fis = new FileInputStream(zipFilePath);
             ZipInputStream zis = new ZipInputStream(fis)) {

            ZipEntry zipEntry;
            while ((zipEntry = zis.getNextEntry()) != null) {
                if (zipEntry.getName().equals(fileNameInZip)) {
                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    byte[] buffer = new byte[1024];
                    int length;
                    while ((length = zis.read(buffer)) >= 0) {
                        baos.write(buffer, 0, length);
                    }
                    zis.closeEntry();
                    return new ByteArrayInputStream(baos.toByteArray());
                }
                zis.closeEntry();
            }
        }
        return null;
    }

    /**
     * Removes file by given id.
     */
    public void removeFile(@Nonnull RecordId fileId) {
        Preconditions.checkNotNull(fileId);

        String fullPath = storageFolderPath + fileId.value() + ".zip";
        File file = new File(fullPath);

        if (!file.exists()) {
            throw new RuntimeException("File not found.");
        }

        file.delete();
    }

    /**
     * Clean all files in root directory.
     */
    public void clean() {
        File file = new File(storageFolderPath);

        if (file.exists()) {
            file.delete();
            file.mkdirs();
        }

    }

}

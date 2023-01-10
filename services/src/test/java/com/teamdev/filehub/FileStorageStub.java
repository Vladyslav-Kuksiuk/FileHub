package com.teamdev.filehub;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.filestorage.FileStorage;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class FileStorageStub extends FileStorage {

    public static String INPUT_STRING = "test";

    public FileStorageStub() {
        super("");
    }

    @Override
    public void uploadFile(RecordId<String> fileId, InputStream fileInput) {

    }

    @Override
    public InputStream downloadFile(RecordId<String> fileId) {
        return new ByteArrayInputStream(INPUT_STRING.getBytes());
    }

    @Override
    public void clean() {

    }
}

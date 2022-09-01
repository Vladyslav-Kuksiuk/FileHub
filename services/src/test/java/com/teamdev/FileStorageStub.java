package com.teamdev;

import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.filestorage.FileStorage;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

public class FileStorageStub extends FileStorage {

    public static String INPUT_STRING = "test";

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

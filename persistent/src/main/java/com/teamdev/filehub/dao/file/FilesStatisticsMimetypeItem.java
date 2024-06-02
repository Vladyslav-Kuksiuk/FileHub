package com.teamdev.filehub.dao.file;

public class FilesStatisticsMimetypeItem {

    private String mimetype;
    private long filesNumber;
    private long size;
    private long archivedSize;

    public FilesStatisticsMimetypeItem(String mimetype, long fileAmount, long size, long archivedSize) {
        this.mimetype = mimetype;
        this.filesNumber = fileAmount;
        this.size = size;
        this.archivedSize = archivedSize;
    }

    public String mimetype() {
        return mimetype;
    }

    public long filesNumber() {
        return filesNumber;
    }

    public long size() {
        return size;
    }

    public long archivedSize() {
        return archivedSize;
    }
}

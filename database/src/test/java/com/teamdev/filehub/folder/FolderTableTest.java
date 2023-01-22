package com.teamdev.filehub.folder;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;

class FolderTableTest {

    private final Gson gson = new Gson();

    @TempDir
    private File tempDir;

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(FolderTable.class);
    }

    @Test
    @DisplayName("Should return list of data with given parent id")
    void testGetByParentId() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var folder1 = "folder1";

        var data1 = new FolderData("id1",
                                   "user1",
                                   folder1,
                                   "fileName1");
        var data2 = new FolderData("id2",
                                   "odufnbvg",
                                   folder1,
                                   "asdfqrgfvdz");
        var data3 = new FolderData("id3",
                                   "jshdf",
                                   "anotherFolder",
                                   "asdfasdf");

        FolderData[] dataArray = {data1, data2, data3};

        var file = new File(filePath);
        file.createNewFile();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var folderTable = new FolderTable(filePath);

        assertThat(folderTable.getByParentId(folder1)).isEqualTo(
                List.of(data1, data2));
    }

    @Test
    @DisplayName("Should return optional data of user root folder")
    void testFindUserRootFolder() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var userId = "userId";

        var data1 = new FolderData("id1",
                                   userId,
                                   null,
                                   "fileName1");
        var data2 = new FolderData("id2",
                                   userId,
                                   "folder1",
                                   "asdfqrgfvdz");
        var data3 = new FolderData("id3",
                                   "anotherUser",
                                   null,
                                   "asdfqrgfvdz");

        FolderData[] dataArray = {data1, data2, data3};

        var file = new File(filePath);
        file.createNewFile();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var folderTable = new FolderTable(filePath);

        assertThat(folderTable.findUserRootFolder(userId)).isEqualTo(
                Optional.of(data1));
    }

    @Test
    @DisplayName("Should return optional data by id")
    void testGetByFolderIdAndNamePart() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var folder1 = "folder1";
        var namePart = "namepart";

        var data1 = new FolderData("id1",
                                   "user1",
                                   folder1,
                                   "fileName1");
        var data2 = new FolderData("id2",
                                   "odufnbvg",
                                   folder1,
                                   "asdfqrgfvdz" + namePart);
        var data3 = new FolderData("id3",
                                   "jshdf",
                                   folder1,
                                   namePart + "asdfasdf");
        var data4 = new FolderData("id4",
                                   "jshdf",
                                   "anotherFolder",
                                   namePart + "asdfasdf");

        FolderData[] dataArray = {data1, data2, data3, data4};

        var file = new File(filePath);
        file.createNewFile();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var folderTable = new FolderTable(filePath);

        assertThat(folderTable.getByParentIdAndNamePart(folder1, namePart)).isEqualTo(
                List.of(data2, data3));
    }

}

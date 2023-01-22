package com.teamdev.filehub.file;

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

import static com.google.common.truth.Truth.assertThat;

class FileTableTest {

    private final Gson gson = new Gson();

    @TempDir
    private File tempDir;

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(FileTable.class);
    }

    @Test
    @DisplayName("Should return list of data with given folderId")
    void testGetByFolderId() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var folder1 = "folder1";

        var data1 = new FileData("id1",
                                 folder1,
                                 "user1",
                                 "fileName1",
                                 "mimetype",
                                 12332);
        var data2 = new FileData("id2",
                                 folder1,
                                 "odufnbvg",
                                 "asdfqrgfvdz",
                                 "osndmfg",
                                 12312);
        var data3 = new FileData("id3",
                                 "anotherFolder",
                                 "jshdf",
                                 "asdfasdf",
                                 "asdfasdf",
                                 12312);

        FileData[] dataArray = {data1, data2, data3};

        var file = new File(filePath);
        file.createNewFile();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var fileTable = new FileTable(filePath);

        assertThat(fileTable.getByFolderId(folder1)).isEqualTo(
                List.of(data1, data2));
    }

    @Test
    @DisplayName("Should return list of data with given folderId and contains name part")
    void testGetByFolderIdAndNamePart() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var folder1 = "folder1";
        var namePart = "namepart";

        var data1 = new FileData("id1",
                                 folder1,
                                 "user1",
                                 "fileName1",
                                 "mimetype",
                                 12332);
        var data2 = new FileData("id2",
                                 folder1,
                                 "odufnbvg",
                                 "asdfqrgfvdz" + namePart,
                                 "osndmfg",
                                 12312);
        var data3 = new FileData("id3",
                                 folder1,
                                 "jshdf",
                                 namePart + "asdfasdf",
                                 "asdfasdf",
                                 12312);
        var data4 = new FileData("id4",
                                 "anotherFolderid",
                                 "jshdf",
                                 namePart + "asdfasdf",
                                 "asdfasdf",
                                 12312);

        FileData[] dataArray = {data1, data2, data3, data4};

        var file = new File(filePath);
        file.createNewFile();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var fileTable = new FileTable(filePath);

        assertThat(fileTable.getByFolderIdAndNamePart(folder1, namePart)).isEqualTo(
                List.of(data2, data3));
    }

}

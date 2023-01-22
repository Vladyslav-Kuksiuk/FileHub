package com.teamdev.filehub;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import javax.annotation.Nonnull;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class InMemoryDatabaseTableTest {

    private final Gson gson = new Gson();

    @TempDir
    private File tempDir;

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(InMemoryDatabaseTable.class);
    }

    @Test
    @DisplayName("Should create file on constructing if it doesn't exist")
    void testFileCreationInConstructor() {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var file = new File(filePath);

        assertThat(file.exists()).isFalse();

        var databaseTable = new InMemoryDatabaseTable<>(filePath,
                                                        Data[].class);

        assertThat(file.exists()).isTrue();
    }

    @Test
    @DisplayName("Should insert data from file in Map if file exist")
    void testFileReading() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var data1 = new Data("id1");
        var data2 = new Data("id2");

        var dataMap = Map.of(data1.id(), data1,
                             data2.id(), data2);
        Data[] dataArray = {data1, data2};

        var file = new File(filePath);
        file.createNewFile();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));

        }

        var databaseTable = new InMemoryDatabaseTable<>(filePath,
                                                        Data[].class);

        assertThat(databaseTable.tableMap()).isEqualTo(dataMap);
    }

    @Test
    @DisplayName("Should return optional data by id")
    void testFindById() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var data1 = new Data("id1");
        var data2 = new Data("id2");

        Data[] dataArray = {data1, data2};

        var file = new File(filePath);
        file.createNewFile();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var databaseTable = new InMemoryDatabaseTable<>(filePath,
                                                        Data[].class);

        assertThat(databaseTable.findById(data1.id())).isEqualTo(Optional.of(data1));
    }

    @Test
    @DisplayName("Should create new data and save it to file")
    void testCreate() throws IOException, InterruptedException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var data1 = new Data("id1");
        var data2 = new Data("id2");
        var data3 = new Data("id3");

        Data[] dataArray = {data1, data2};

        var file = new File(filePath);
        file.createNewFile();

        try (var writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var databaseTable = new InMemoryDatabaseTable<>(filePath,
                                                        Data[].class);

        databaseTable.create(data3);

        Thread.sleep(200);

        assertThat(databaseTable.tableMap()
                                .get(data3.id())).isEqualTo(data3);

        try (var reader = new FileReader(file);
             var scanner = new Scanner(reader)
        ) {
            Data[] newArray = {data1, data2, data3};
            var fileLine = scanner.nextLine();
            var expectedLine = gson.toJson(newArray);

            assertThat(fileLine).isEqualTo(expectedLine);
        }
    }

    @Test
    @DisplayName("Should throw RuntimeException if data to create already exists")
    void testCreateExistingData() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var data1 = new TestData("id1", "field1");
        var data2 = new TestData("id2", "field2");

        TestData[] dataArray = {data1, data2};

        var file = new File(filePath);
        file.createNewFile();

        try (var writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var databaseTable = new InMemoryDatabaseTable<>(filePath,
                                                        TestData[].class);

        assertThrows(RuntimeException.class, () -> databaseTable.create(data2));
    }

    @Test
    @DisplayName("Should delete data and save changes to file")
    void testDelete() throws IOException, InterruptedException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var data1 = new Data("id1");
        var data2 = new Data("id2");

        Data[] dataArray = {data1, data2};

        var file = new File(filePath);
        file.createNewFile();

        try (var writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var databaseTable = new InMemoryDatabaseTable<>(filePath,
                                                        Data[].class);

        databaseTable.delete(data2.id());

        Thread.sleep(200);

        assertThat(databaseTable.tableMap()
                                .get(data2.id())).isNull();

        try (var reader = new FileReader(file);
             var scanner = new Scanner(reader)
        ) {
            Data[] newArray = {data1};
            var fileLine = scanner.nextLine();
            var expectedLine = gson.toJson(newArray);

            assertThat(fileLine).isEqualTo(expectedLine);
        }
    }

    @Test
    @DisplayName("Should throw RuntimeException if data to delete not found")
    void testDeleteAbsentData() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var data1 = new TestData("id1", "field1");
        var data2 = new TestData("id2", "field2");

        TestData[] dataArray = {data1, data2};

        var file = new File(filePath);
        file.createNewFile();

        try (var writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var databaseTable = new InMemoryDatabaseTable<>(filePath,
                                                        TestData[].class);

        assertThrows(RuntimeException.class, () -> databaseTable.delete("id3"));
    }

    @Test
    @DisplayName("Should update data and save changes to file")
    void testUpdateWithoutExceptions() throws IOException, InterruptedException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var data1 = new TestData("id1", "field1");
        var data2 = new TestData("id2", "field2");
        var updatedData2 = new TestData(data2.id(), "newField2");

        TestData[] dataArray = {data1, data2};

        var file = new File(filePath);
        file.createNewFile();

        try (var writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var databaseTable = new InMemoryDatabaseTable<>(filePath,
                                                        TestData[].class);

        databaseTable.update(updatedData2);

        Thread.sleep(200);

        assertThat(databaseTable.tableMap()
                                .get(data2.id()).field)
                .isEqualTo(updatedData2.field);

        try (var reader = new FileReader(file);
             var scanner = new Scanner(reader)
        ) {
            TestData[] newArray = {data1, updatedData2};
            var fileLine = scanner.nextLine();
            var expectedLine = gson.toJson(newArray);

            assertThat(fileLine).isEqualTo(expectedLine);
        }
    }

    @Test
    @DisplayName("Should throw RuntimeException if data to update not found")
    void testUpdateAbsentData() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var data1 = new TestData("id1", "field1");
        var data2 = new TestData("id2", "field2");
        var updatedData2 = new TestData("id3", "newField2");

        TestData[] dataArray = {data1, data2};

        var file = new File(filePath);
        file.createNewFile();

        try (var writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var databaseTable = new InMemoryDatabaseTable<>(filePath,
                                                        TestData[].class);

        assertThrows(RuntimeException.class, () -> databaseTable.update(updatedData2));
    }

    private class TestData extends Data {

        private final String field;

        public TestData(@Nonnull String id,
                        String field) {
            super(id);
            this.field = field;
        }
    }

}

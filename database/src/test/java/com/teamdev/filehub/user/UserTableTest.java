package com.teamdev.filehub.user;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Optional;

import static com.google.common.truth.Truth.assertThat;

class UserTableTest {

    private final Gson gson = new Gson();

    @TempDir
    private File tempDir;

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(UserTable.class);
    }

    @Test
    @DisplayName("Should return optional data by id")
    void testGetUserByLogin() throws IOException {
        var filePath = tempDir.getPath() + File.separator + "table.json";

        var data1 = new UserData("id1", "login1", "password1");
        var data2 = new UserData("id2", "login2", "password2");

        UserData[] dataArray = {data1, data2};

        var file = new File(filePath);
        file.createNewFile();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(gson.toJson(dataArray));
        }

        var userTable = new UserTable(filePath);

        assertThat(userTable.getUserByLogin(data2.login())).isEqualTo(Optional.of(data2));
    }

}

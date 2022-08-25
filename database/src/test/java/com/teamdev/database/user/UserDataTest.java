package com.teamdev.database.user;

import com.google.common.testing.NullPointerTester;
import com.google.common.truth.Truth;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class UserDataTest {

    @Test
    void createUserDataTest() {

        UserData userData = new UserData("user",
                                         "user",
                                         "password",
                                         "email@email.com");

        Truth.assertWithMessage("User id reading failed.")
             .that(userData.id())
             .matches("user");

        Truth.assertWithMessage("User login reading failed.")
             .that(userData.login())
             .matches("user");

        Truth.assertWithMessage("User password reading failed.")
             .that(userData.password())
             .matches("password");

        Truth.assertWithMessage("User email reading failed.")
             .that(userData.email())
             .matches("email@email.com");

    }

    @Test
    void illegalLoginTest() {

        assertThrows(IllegalStateException.class, () -> {
            UserData userData = new UserData("user",
                                             "",
                                             "password",
                                             "email@email.com");
        }, "User data creation with illegal login passed.");

    }

    @Test
    void illegalPasswordTest() {

        assertThrows(IllegalStateException.class, () -> {
            UserData userData = new UserData("user",
                                             "user",
                                             "",
                                             "email@email.com");
        }, "User data creation with illegal password passed.");

    }

    @Test
    void illegalEmailTest() {

        assertThrows(IllegalStateException.class, () -> {
            UserData userData = new UserData("user",
                                             "user",
                                             "password",
                                             "email.com");
        }, "User data creation with illegal email passed.");

    }

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "email@email.com");
        tester.testAllPublicConstructors(UserData.class);

    }
}
package com.teamdev.processes.register;

import com.google.common.testing.NullPointerTester;
import com.teamdev.processes.register.UserRegistrationCommand;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class UserRegistrationCommandTest {

    @Test
    void invalidLoginTest() {

        assertThrows(IllegalStateException.class, () -> {
            UserRegistrationCommand command =
                    new UserRegistrationCommand("",
                                                "password",
                                                "email@email.com");
        }, "User registration command creation with illegal login passed.");

    }

    @Test
    void invalidPasswordTest() {

        assertThrows(IllegalStateException.class, () -> {
            UserRegistrationCommand command =
                    new UserRegistrationCommand("Hellamb",
                                                "",
                                                "email@email.com");
        }, "User registration command creation with illegal password passed.");

    }

    @Test
    void invalidEmailTest() {

        assertThrows(IllegalStateException.class, () -> {
            UserRegistrationCommand command =
                    new UserRegistrationCommand("Hellamb",
                                                "password",
                                                "email.com");
        }, "User registration command creation with illegal email passed.");

    }

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "email@email.com");
        tester.testAllPublicConstructors(UserRegistrationCommand.class);

    }

}
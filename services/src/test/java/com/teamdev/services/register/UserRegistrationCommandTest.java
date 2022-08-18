package com.teamdev.services.register;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class UserRegistrationCommandTest {

    @Test
    void invalidLoginTest() {

        assertThrows(IllegalStateException.class, () -> {
            UserRegistrationCommand command = new UserRegistrationCommand("",
                                                                          "password",
                                                                          "vlad.kuksiuk@gmail.com");
        });

    }

    @Test
    void invalidPasswordTest() {

        assertThrows(IllegalStateException.class, () -> {
            UserRegistrationCommand command = new UserRegistrationCommand("Hellamb",
                                                                          "",
                                                                          "vlad.kuksiuk@gmail.com");
        });

    }

    @Test
    void invalidEmailTest() {

        assertThrows(IllegalStateException.class, () -> {
            UserRegistrationCommand command = new UserRegistrationCommand("Hellamb",
                                                                          "password",
                                                                          "vlad.kuksiukgmail.com");
        });

    }

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "vlad.kuksiuk@gmail.com");
        tester.testAllPublicConstructors(UserRegistrationCommand.class);

    }

}
package com.teamdev.filehub.processes.register;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class UserRegistrationCommandTest {

    @Test
    void invalidLoginTest() {

        assertThrows(FieldValidationException.class, () -> {
            UserRegistrationCommand command =
                    new UserRegistrationCommand("",
                                                "password");
        }, "User registration command creation with illegal login passed.");

    }

    @Test
    void invalidPasswordTest() {

        assertThrows(FieldValidationException.class, () -> {
            UserRegistrationCommand command =
                    new UserRegistrationCommand("Hellamb",
                                                "");
        }, "User registration command creation with illegal password passed.");

    }

    @Test
    void nullTest(){

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "email@email.com");
        tester.testAllPublicConstructors(UserRegistrationCommand.class);

    }

}

package com.teamdev.filehub.processes.user.register;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.RequestFieldValidationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertThrows;

class UserRegistrationCommandTest {

    private static Stream<Arguments> negativeLoginCases() {

        return Stream.of(
                Arguments.of("hello"),
                Arguments.of("@gmail.com"),
                Arguments.of("123@1.c"),
                Arguments.of("")
        );
    }

    private static Stream<Arguments> negativePasswordCases() {

        return Stream.of(
                Arguments.of("hello1"),
                Arguments.of("helloasa"),
                Arguments.of("123456789"),
                Arguments.of("!@#$%^&*()"),
                Arguments.of("")
        );
    }

    @ParameterizedTest
    @MethodSource("negativeLoginCases")
    void invalidLoginTest(String login) {
        assertThrows(RequestFieldValidationException.class,
                     () -> new UserRegistrationCommand(login, "hello123123"),
                     "User registration command creation with illegal password passed.");

    }

    @ParameterizedTest
    @MethodSource("negativePasswordCases")
    void invalidPasswordTest(String password) {
        assertThrows(RequestFieldValidationException.class,
                     () -> new UserRegistrationCommand("myEmail@gmail.com", password),
                     "User registration command creation with illegal password passed.");

    }

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "email@email.com");
        tester.testAllPublicConstructors(UserRegistrationCommand.class);

    }

}

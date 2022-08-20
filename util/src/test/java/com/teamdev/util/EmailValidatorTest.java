package com.teamdev.util;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;

class EmailValidatorTest {

    @Test
    void validateCorrectEmailTest() {
        assertWithMessage("Email validation failed.")
                .that(EmailValidator.validate("email@email.com"))
                .isTrue();
    }

    @Test
    void validateIncorrectEmailTest() {
        assertWithMessage("Email validation failed.")
                .that(EmailValidator.validate("email.com"))
                .isFalse();
    }

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicStaticMethods(EmailValidator.class);
    }

}
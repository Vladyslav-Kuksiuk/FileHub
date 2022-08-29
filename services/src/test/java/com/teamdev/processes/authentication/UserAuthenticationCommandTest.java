package com.teamdev.processes.authentication;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class UserAuthenticationCommandTest {

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "FN458FB847BF");
        tester.testAllPublicConstructors(UserAuthenticationCommand.class);

    }

}
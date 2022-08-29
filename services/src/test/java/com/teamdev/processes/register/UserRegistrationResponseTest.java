package com.teamdev.processes.register;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class UserRegistrationResponseTest {

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(UserRegistrationResponse.class);

    }
}
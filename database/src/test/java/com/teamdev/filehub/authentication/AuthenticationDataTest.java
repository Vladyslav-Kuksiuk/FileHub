package com.teamdev.filehub.authentication;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class AuthenticationDataTest {

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(AuthenticationData.class);
    }
}

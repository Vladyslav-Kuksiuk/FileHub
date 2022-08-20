package com.teamdev.util;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class StringEncryptorTest {

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicStaticMethods(StringEncryptor.class);
    }

}
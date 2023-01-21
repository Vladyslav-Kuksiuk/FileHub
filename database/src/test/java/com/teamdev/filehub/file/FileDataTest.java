package com.teamdev.filehub.file;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.authentication.AuthenticationData;
import org.junit.jupiter.api.Test;

class FileDataTest {

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(AuthenticationData.class);
    }

}

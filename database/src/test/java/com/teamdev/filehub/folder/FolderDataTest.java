package com.teamdev.filehub.folder;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.authentication.AuthenticationData;
import org.junit.jupiter.api.Test;

class FolderDataTest {

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(AuthenticationData.class);
    }

}

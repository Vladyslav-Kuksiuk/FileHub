package com.teamdev.services.download;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class FileDownloadQueryTest {

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(FileDownloadQuery.class);

    }

}
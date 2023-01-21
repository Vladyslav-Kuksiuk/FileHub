package com.teamdev.filehub.dao;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class DatabaseRecordTest {

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(DatabaseRecord.class);
    }

}

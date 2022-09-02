package com.teamdev.filehub.dao.file;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.Test;

class FileRecordTest {

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<String>("user"));
        tester.testAllPublicConstructors(FileRecord.class);
    }

}
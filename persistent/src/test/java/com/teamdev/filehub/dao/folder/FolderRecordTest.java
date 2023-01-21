package com.teamdev.filehub.dao.folder;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.Test;

class FolderRecordTest {

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId("user"));
        tester.testAllPublicConstructors(FolderRecord.class);
    }
}

package com.teamdev.filehub.views.folder.info;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class FolderInfoQueryTest {

    @Test
    @DisplayName("Constructor NullPointer test")
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId("user"));
        tester.testAllPublicConstructors(FolderInfoQuery.class);

    }

}

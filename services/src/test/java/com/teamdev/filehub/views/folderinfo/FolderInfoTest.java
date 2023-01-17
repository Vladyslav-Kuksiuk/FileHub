package com.teamdev.filehub.views.folderinfo;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class FolderInfoTest {

    @Test
    @DisplayName("Constructor NullPointer test")
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(FolderInfo.class);

    }

}

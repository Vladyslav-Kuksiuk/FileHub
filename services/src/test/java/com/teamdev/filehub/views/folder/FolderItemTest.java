package com.teamdev.filehub.views.folder;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class FolderItemTest {

    @Test
    @DisplayName("Constructor NullPointer test")
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(FolderItem.class);

    }

}

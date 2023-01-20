package com.teamdev.filehub.views.folder.search;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.folder.content.FolderContentQuery;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class FolderSearchQueryTest {

    @Test
    @DisplayName("Constructor NullPointer test")
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<>("user"));
        tester.testAllPublicConstructors(FolderContentQuery.class);

    }

}

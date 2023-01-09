package com.teamdev.filehub.processes.foldercreate;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.processes.folder.create.FolderCreateCommand;
import org.junit.jupiter.api.Test;

class FolderCreateCommandTest {

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "123");
        tester.testAllPublicConstructors(FolderCreateCommand.class);

    }

}

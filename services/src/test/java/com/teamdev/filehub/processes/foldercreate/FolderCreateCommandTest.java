package com.teamdev.filehub.processes.foldercreate;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.RequestFieldValidationException;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertThrows;

class FolderCreateCommandTest {

    private static Stream<Arguments> negativeNameCases() {

        return Stream.of(
                Arguments.of("hello>"),
                Arguments.of("folderName with @"),
                Arguments.of("folderName with &"),
                Arguments.of("folderName with '"),
                Arguments.of("folderName with ;"),
                Arguments.of("folderName with :"),
                Arguments.of("folderName with !"),
                Arguments.of("folderName with +"),
                Arguments.of("folderName with #"),
                Arguments.of("folderName with %"),
                Arguments.of("folderName with ?"),
                Arguments.of("folderName with ,"),
                Arguments.of("folderName with <"),
                Arguments.of(""),
                Arguments.of("More then 50 symbols 123456789012345678901234567890123456789")
        );
    }

    private static Stream<Arguments> positiveNameCases() {

        return Stream.of(
                Arguments.of("hello"),
                Arguments.of("Folder name with spaces"),
                Arguments.of("123123"),
                Arguments.of("MyFolder.folder")
        );
    }

    @Test
    void nullTest() {

        var tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<>("user"));
        tester.testAllPublicConstructors(FolderCreateCommand.class);

    }

    @ParameterizedTest
    @MethodSource("negativeNameCases")
    void invalidFolderNameTest(String folderName) {
        assertThrows(RequestFieldValidationException.class,
                     () -> new FolderCreateCommand(new RecordId<>("userId"),
                                                   new RecordId<>("folderId"),
                                                   folderName),
                     "Folder creation command creation with illegal folder name passed.");

    }

    @ParameterizedTest
    @MethodSource("positiveNameCases")
    void validFolderNameTest(String folderName) throws RequestFieldValidationException {
        var command = new FolderCreateCommand(new RecordId<>("userId"),
                                              new RecordId<>("folderId"),
                                              folderName);
    }

}

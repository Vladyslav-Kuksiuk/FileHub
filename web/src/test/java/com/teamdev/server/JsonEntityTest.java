package com.teamdev.server;

import com.google.common.testing.NullPointerTester;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class JsonEntityTest {

    @Test
    @DisplayName("Should throw NullPointerException on null in constructors and methods params")
    void testConstructorNullPointer() {

        NullPointerTester tester = new NullPointerTester();

        tester.testAllPublicConstructors(JsonEntity.class);

        tester.testInstanceMethods(new JsonEntity(new JsonObject()),
                                   NullPointerTester.Visibility.PUBLIC);

    }

    @Test
    @DisplayName("Should return JSON entity field value as String")
    void testGetAsStringSuccess() throws JsonEntityValidationException {

        String fieldName = "fieldName";
        String fieldValue = "fieldValue";

        var jsonElement = Mockito.mock(JsonElement.class);
        Mockito.when(jsonElement.getAsString())
               .thenReturn(fieldValue);

        JsonObject jsonObject = new JsonObject();
        jsonObject.add(fieldName, jsonElement);

        JsonEntity jsonEntity = new JsonEntity(jsonObject);

        assertWithMessage("JSON entity field was not returned as a string")
                .that(jsonEntity.getAsString(fieldName))
                .isEqualTo(fieldValue);
    }

    @Test
    @DisplayName("Should throw JsonEntityValidationException because field not found")
    void testGettersOnFieldExistence() {

        JsonObject jsonObject = new JsonObject();

        JsonEntity jsonEntity = new JsonEntity(jsonObject);

        assertThrows(JsonEntityValidationException.class, () -> {
            String value = jsonEntity.getAsString("wrongField");
        }, "JsonEntityValidationException was not thrown in getAsString method");

        assertThrows(JsonEntityValidationException.class, () -> {
            int value = jsonEntity.getAsInteger("wrongField");
        }, "JsonEntityValidationException was not thrown in getAsInteger method");
    }

    @Test
    @DisplayName("Should throw JsonEntityValidationException because field type mismatch")
    void testGettersOnFieldTypes() {

        String fieldName = "fieldName";

        var jsonElement = Mockito.mock(JsonElement.class);

        JsonObject jsonObject = new JsonObject();
        jsonObject.add(fieldName, jsonElement);

        JsonEntity jsonEntity = new JsonEntity(jsonObject);

        Mockito.when(jsonElement.getAsString())
               .thenThrow(new UnsupportedOperationException());

        assertThrows(JsonEntityValidationException.class, () -> {
            String value = jsonEntity.getAsString(fieldName);
        }, "JsonEntityValidationException was not thrown in getAsString method");

        Mockito.when(jsonElement.getAsInt())
               .thenThrow(new UnsupportedOperationException());

        assertThrows(JsonEntityValidationException.class, () -> {
            int value = jsonEntity.getAsInteger(fieldName);
        }, "JsonEntityValidationException was not thrown in getAsInteger method");
    }

    @Test
    @DisplayName("Should return JSON entity field value as Integer")
    void testGetAsIntegerSuccess() throws JsonEntityValidationException {

        String fieldName = "fieldName";
        Integer fieldValue = 123;

        var jsonElement = Mockito.mock(JsonElement.class);
        Mockito.when(jsonElement.getAsInt())
               .thenReturn(fieldValue);

        JsonObject jsonObject = new JsonObject();
        jsonObject.add(fieldName, jsonElement);

        JsonEntity jsonEntity = new JsonEntity(jsonObject);

        assertWithMessage("JSON entity field was not returned as a Integer")
                .that(jsonEntity.getAsInteger(fieldName))
                .isEqualTo(fieldValue);
    }

}

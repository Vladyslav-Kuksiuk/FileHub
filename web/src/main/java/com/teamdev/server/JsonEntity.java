package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import javax.annotation.Nonnull;
import java.util.function.Function;

/**
 * Wrapper for {@link JsonObject} to make work with fields more convenient.
 * Throws {@link JsonEntityValidationException} if JSON object don't have fields with given names
 * or field values can't be converted into correct types.
 */
public class JsonEntity {

    private final JsonObject jsonObject;

    public JsonEntity(@Nonnull JsonObject jsonObject) {
        this.jsonObject = Preconditions.checkNotNull(jsonObject);
    }

    /**
     * Returns JSON object's field by given name as {@link String}.
     *
     * @param fieldName
     *         - The JSON object field name.
     * @return JSON object's field as {@link String}.
     * @throws JsonEntityValidationException
     *         If JSON object don't have field with given name
     *         or field value can't be converted into {@link String}.
     */
    public String getAsString(@Nonnull String fieldName) throws JsonEntityValidationException {
        Preconditions.checkNotNull(fieldName);
        return get(fieldName, JsonElement::getAsString);
    }

    /**
     * Returns JSON object's field by given name as {@link Integer}.
     *
     * @param fieldName
     *         - The JSON object field name.
     * @return JSON object's field as {@link Integer}.
     * @throws JsonEntityValidationException
     *         If JSON object don't have field with given name
     *         or field value can't be converted into {@link Integer}.
     */
    public Integer getAsInteger(@Nonnull String fieldName) throws JsonEntityValidationException {
        Preconditions.checkNotNull(fieldName);
        return get(fieldName, JsonElement::getAsInt);
    }

    private <T> T get(String fieldName, Function<JsonElement, T> getFunction)
            throws JsonEntityValidationException {

        if (!jsonObject.has(fieldName)) {
            throw new JsonEntityValidationException("Field " + fieldName + " not found in JSON");
        }

        try {

            return getFunction.apply(jsonObject.get(fieldName));

        } catch (UnsupportedOperationException | IllegalStateException exception) {

            throw new JsonEntityValidationException("Field " + fieldName + " has incorrect type.");

        }
    }
}

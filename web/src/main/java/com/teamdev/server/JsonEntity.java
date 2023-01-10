package com.teamdev.server;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import javax.annotation.Nullable;
import java.util.Objects;
import java.util.function.Function;

public class JsonEntity {

    private final JsonObject jsonBody;

    public JsonEntity(@Nullable JsonObject jsonBody) {

        this.jsonBody = Objects.requireNonNullElseGet(jsonBody, JsonObject::new);
    }

    public String getAsString(String memberName) throws JsonEntityValidationException {
        return get(memberName, JsonElement::getAsString);
    }

    public Integer getAsInteger(String memberName) throws JsonEntityValidationException {
        return get(memberName, JsonElement::getAsInt);
    }

    private <T> T get(String memberName, Function<JsonElement, T> getFunction)
            throws JsonEntityValidationException {

        JsonElement jsonElement = jsonBody.get(memberName);

        if (jsonElement == null) {
            throw new JsonEntityValidationException("Field " + memberName + " not found in JSON");
        }

        try {

            return getFunction.apply(jsonElement);

        } catch (UnsupportedOperationException | IllegalStateException exception) {

            throw new JsonEntityValidationException("Field " + memberName + " has incorrect type.");

        }
    }
}

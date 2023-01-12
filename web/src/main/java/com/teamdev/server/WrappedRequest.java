package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import spark.Request;

import javax.annotation.Nonnull;
import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

/**
 * Wrapper for {@link Request} to provide work with body as {@link JsonEntity}.
 */
public class WrappedRequest {

    private final Gson gson = new Gson();

    private final JsonEntity jsonBody;
    private final Request request;

    public WrappedRequest(@Nonnull Request request) {
        Preconditions.checkNotNull(request);

        var jsonObject =
                Objects.requireNonNullElseGet(gson.fromJson(request.body(), JsonObject.class),
                                              JsonObject::new);

        jsonBody = new JsonEntity(jsonObject);
        this.request = request;
    }

    /**
     * @return HTTP body representation as {@link JsonEntity}.
     */
    public JsonEntity jsonBody() {
        return jsonBody;
    }

    /**
     * @return The raw HttpServletRequest object.
     */
    public HttpServletRequest raw() {
        return request.raw();
    }

    /**
     * Gets the value for the provided header.
     *
     * @param header
     *         HTTP request header name.
     * @return The value of the provided header.
     */
    public String headers(@Nonnull String header) {
        Preconditions.checkNotNull(header);
        return request.headers(header);
    }
}

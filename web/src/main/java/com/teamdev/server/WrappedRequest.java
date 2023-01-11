package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import spark.Request;

import javax.annotation.Nonnull;
import javax.servlet.http.HttpServletRequest;

/**
 * Wrapper for {@link Request} to provide work with body as {@link JsonEntity}.
 */
public class WrappedRequest {

    private final Gson gson = new Gson();

    private final JsonEntity jsonBody;
    private final Request request;

    public WrappedRequest(@Nonnull Request request) {
        Preconditions.checkNotNull(request);

        jsonBody = new JsonEntity(gson.fromJson(request.body(), JsonObject.class));
        this.request = request;
    }

    public JsonEntity jsonBody() {
        return jsonBody;
    }

    public HttpServletRequest raw() {
        return request.raw();
    }

    public String headers(@Nonnull String header) {
        return request.headers(header);
    }
}

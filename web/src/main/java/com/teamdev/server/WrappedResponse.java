package com.teamdev.server;

import com.google.common.base.Preconditions;
import spark.Response;

import javax.annotation.Nonnull;
import javax.servlet.http.HttpServletResponse;

public class WrappedResponse {

    private final Response response;
    private String body = "";

    public WrappedResponse(@Nonnull Response response) {
        Preconditions.checkNotNull(response);
        this.response = response;
    }

    public String body() {
        return body;
    }

    public void setBody(@Nonnull String body) {
        this.body = Preconditions.checkNotNull(body);
    }

    public void setStatus(int statusCode) {
        response.status(statusCode);
    }

    public HttpServletResponse raw() {
        return response.raw();
    }
}

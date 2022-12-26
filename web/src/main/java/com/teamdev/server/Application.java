package com.teamdev.server;

import static spark.Spark.get;
import static spark.Spark.staticFiles;

public class Application {
    public static void main(String[] args) {
        staticFiles.location("/web-client");

        get("/hello", (req, res) -> "Hello, World!");
    }
}

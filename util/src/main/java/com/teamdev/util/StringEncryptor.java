package com.teamdev.util;

import com.google.common.base.Charsets;
import com.google.common.base.Preconditions;
import com.google.common.hash.Hashing;

public class StringEncryptor {

    private static final String SECRET_WORD = "8n73o87rhf5boa8r7gfb";

    public static String encrypt(String text) {
        Preconditions.checkNotNull(text);
        return Hashing.sha256()
                      .hashString(text + SECRET_WORD, Charsets.UTF_8)
                      .toString();
    }
}

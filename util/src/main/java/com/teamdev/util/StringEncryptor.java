package com.teamdev.util;

import com.google.common.base.Charsets;
import com.google.common.base.Preconditions;
import com.google.common.hash.Hashing;

import javax.annotation.Nonnull;
import java.nio.charset.StandardCharsets;

/**
 * Class for string encrypting.
 */
public class StringEncryptor {

    private static final String SECRET_WORD = "8n73o87rhf5boa8r7gfb";

    private StringEncryptor() {
    }

    public static String encrypt(@Nonnull String text) {
        Preconditions.checkNotNull(text);

        return Hashing.hmacSha256(SECRET_WORD.getBytes(StandardCharsets.UTF_8))
                      .hashString(text, Charsets.UTF_8)
                      .toString();
    }
}

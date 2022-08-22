package com.teamdev.util;

import com.google.common.base.Preconditions;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Class to validate email.
 */
public class EmailValidator {

    private static final String EMAIL_PATTERN =
            "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
                    "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

    private EmailValidator() {
    }

    /**
     * Method to validate {@link CharSequence} as email.
     *
     * @param email
     *         Email.
     * @return Validation result.
     */
    public static boolean validate(CharSequence email) {
        Preconditions.checkNotNull(email);
        Pattern pattern = Pattern.compile(EMAIL_PATTERN);
        Matcher matcher = pattern.matcher(email);

        return matcher.matches();
    }

}

package com.teamdev.util;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * Class with utils for work with LocalDateTime.
 */
public class LocalDateTimeUtil {

    public static final ZoneId TIME_ZONE = ZoneId.of("UTC+02:00");

    public static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private LocalDateTimeUtil() {
    }

}

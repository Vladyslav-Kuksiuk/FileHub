/*
 * This file was generated by the Gradle 'init' task.
 *
 * This generated file contains a sample Java application project to get you started.
 * For more details take a look at the 'Building Java & JVM projects' chapter in the Gradle
 * User Manual available at https://docs.gradle.org/7.5.1/userguide/building_java_projects.html
 */
import net.ltgt.gradle.errorprone.errorprone

plugins {
    // Apply the application plugin to add support for building a CLI application in Java.
    application
    id("net.ltgt.errorprone") version "2.0.2"
}

repositories {
    // Use Maven Central for resolving dependencies.
    mavenCentral()
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(15))
    }
}

buildscript {

    repositories {
        maven {
            url = uri("https://plugins.gradle.org/m2/")
        }
    }

    dependencies {
        classpath("net.ltgt.gradle:gradle-errorprone-plugin:2.0.2")
    }

}

apply(plugin = "net.ltgt.errorprone")

dependencies {

    implementation(project(":persistent"))
    implementation(project(":util"))
    implementation(project(":database"))

    // Use JUnit Jupiter for testing.
    testImplementation("org.junit.jupiter:junit-jupiter:5.8.2")

    // This dependency is used by the application.
    testImplementation("com.google.guava:guava-testlib:31.1-jre")
    implementation("com.google.guava:guava:31.1-jre")

    implementation("javax.validation:validation-api:2.0.1.Final")

    compileOnly("com.google.errorprone:error_prone_core:2.9.0")

    implementation("org.jasypt:jasypt:1.9.3")

    testImplementation("com.google.truth:truth:1.1.3")

    // Logging libs
    implementation("com.google.flogger:flogger:0.7.4")
    implementation("com.google.flogger:flogger-log4j2-backend:0.7.4")

    implementation("com.google.code.findbugs:jsr305:3.0.2")
}

application {
    // Define the main class for the application.
    mainClass.set("filehub.App")
}

tasks.named<Test>("test") {
    // Use JUnit Platform for unit tests.
    useJUnitPlatform()
}

tasks.withType<JavaCompile>().configureEach {
    options.errorprone.disableWarningsInGeneratedCode.set(true)
}

tasks.named<JavaCompile>("compileTestJava") {
    options.errorprone.isEnabled.set(false)
}

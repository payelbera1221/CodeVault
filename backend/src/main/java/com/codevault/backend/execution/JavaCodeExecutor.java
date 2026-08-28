package com.codevault.backend.execution;

import com.codevault.backend.entity.ExecutionResult;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@Service
public class JavaCodeExecutor {

    public ExecutionResult execute(String code, String input) {

        Path tempDirectory = null;

        try {
            tempDirectory = Files.createTempDirectory("codevault-java-");

            Path javaFile = tempDirectory.resolve("Main.java");

            Files.writeString(javaFile, code);

            ProcessBuilder compileProcess = new ProcessBuilder(
                    "javac",
                    javaFile.toString());

            compileProcess.redirectErrorStream(true);

            Process compiler = compileProcess.start();

            String compileOutput = readOutput(compiler);

            boolean compiled = compiler.waitFor(10, TimeUnit.SECONDS);

            if (!compiled) {
                compiler.destroyForcibly();

                return new ExecutionResult(
                        false,
                        "",
                        "Compilation timed out.",
                        0);
            }

            if (compiler.exitValue() != 0) {
                return new ExecutionResult(
                        false,
                        "",
                        compileOutput,
                        0);
            }

            ProcessBuilder runProcess = new ProcessBuilder(
                    "java",
                    "-cp",
                    tempDirectory.toString(),
                    "Main");

            runProcess.redirectErrorStream(true);

            Process process = runProcess.start();

            if (input != null) {
                try (BufferedWriter writer = new BufferedWriter(
                        new OutputStreamWriter(
                                process.getOutputStream()))) {

                    writer.write(input);
                    writer.newLine();
                }
            }

            long startTime = System.currentTimeMillis();

            boolean finished = process.waitFor(5, TimeUnit.SECONDS);

            long executionTime = System.currentTimeMillis() - startTime;

            if (!finished) {

                process.destroyForcibly();

                return new ExecutionResult(
                        false,
                        "",
                        "Execution timed out.",
                        executionTime);
            }

            String output = readOutput(process);

            if (process.exitValue() != 0) {
                return new ExecutionResult(
                        false,
                        "",
                        output,
                        executionTime);
            }

            return new ExecutionResult(
                    true,
                    output.trim(),
                    null,
                    executionTime);

        } catch (Exception e) {

            return new ExecutionResult(
                    false,
                    "",
                    e.getMessage(),
                    0);

        } finally {

            if (tempDirectory != null) {
                deleteDirectory(tempDirectory);
            }
        }
    }

    private String readOutput(Process process)
            throws IOException {

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                        process.getInputStream()))) {

            StringBuilder output = new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append(System.lineSeparator());
            }

            return output.toString();
        }
    }

    private void deleteDirectory(Path directory) {

        try {

            Files.walk(directory)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(path -> {

                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException ignored) {
                        }

                    });

        } catch (IOException ignored) {
        }
    }
}
package com.nyaymitra.kernel;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NyayKernelApplication {

	public static void main(String[] args) {
		// Load .env from the backend root directory (parent of nyay-kernel)
		Dotenv dotenv = Dotenv.configure()
				.directory("..")
				.ignoreIfMissing()
				.load();
		
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		
		SpringApplication.run(NyayKernelApplication.class, args);
	}

}

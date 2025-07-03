package com.flockshop.wishlist_backend;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileInputStream;

@SpringBootApplication
public class WishlistBackendApplication {

	public static void main(String[] args) {
		initializeFirebase(); // ✅ call before app starts
		SpringApplication.run(WishlistBackendApplication.class, args);
	}

	private static void initializeFirebase() {
		try {
			FileInputStream serviceAccount =
					new FileInputStream("src/main/resources/serviceAccountKey.json");

			FirebaseOptions options = FirebaseOptions.builder()
					.setCredentials(GoogleCredentials.fromStream(serviceAccount))
					.build();

			if (FirebaseApp.getApps().isEmpty()) {
				FirebaseApp.initializeApp(options);
				System.out.println("✅ Firebase Initialized from main()");
			}
		} catch (Exception e) {
			System.err.println("❌ Firebase init failed in main:");
			e.printStackTrace();
		}
	}
}

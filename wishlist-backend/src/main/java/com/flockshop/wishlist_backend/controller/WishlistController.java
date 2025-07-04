package com.flockshop.wishlist_backend.controller;

import com.flockshop.wishlist_backend.model.ProductItem;
import com.flockshop.wishlist_backend.model.Wishlist;
import com.flockshop.wishlist_backend.service.WishlistService;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlists")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PostMapping
    public ResponseEntity<String> createWishlist(@RequestBody Wishlist wishlist) {
        try {
            String id = wishlistService.createWishlist(wishlist);
            return ResponseEntity.ok(id);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getWishlist(@PathVariable String id) {
        try {
            Wishlist wishlist = wishlistService.getWishlist(id);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Wishlist not found");
        }
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Wishlist>> getWishlistsByUser(@PathVariable String email) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<Wishlist> result = db.collection("wishlists")
                    .whereEqualTo("createdBy", email)
                    .get()
                    .get()
                    .getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(Wishlist.class))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace(); // optional: log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<String> addItem(@PathVariable String id, @RequestBody ProductItem item) {
        try {
            wishlistService.addProductToWishlist(id, item);
            return ResponseEntity.ok("Item added");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable String id, @PathVariable String itemId) {
        try {
            wishlistService.removeProduct(id, itemId);
            return ResponseEntity.ok("Item removed");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    @PutMapping("/{id}/rename")
    public ResponseEntity<?> renameWishlist(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String newName = body.get("name");
            wishlistService.renameWishlist(id, newName);  // Implement this method
            return ResponseEntity.ok("Wishlist renamed");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWishlist(@PathVariable String id) {
        try {
            wishlistService.deleteWishlist(id);  // Implement this method
            return ResponseEntity.ok("Wishlist deleted");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }



    @PostMapping("/{id}/collaborators")
    public ResponseEntity<?> addCollaborator(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String role = body.get("role");
            Wishlist wishlist = getWishlistById(id);
            wishlist.getRoles().put(email, role);
            saveWishlist(wishlist);
            return ResponseEntity.ok("Collaborator added");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/collaborators")
    public ResponseEntity<?> updateRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String role = body.get("role");
            Wishlist wishlist = getWishlistById(id);
            wishlist.getRoles().put(email, role);
            saveWishlist(wishlist);
            return ResponseEntity.ok("Role updated");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/collaborators/{email}")
    public ResponseEntity<?> removeCollaborator(@PathVariable String id, @PathVariable String email) {
        try {
            Wishlist wishlist = getWishlistById(id);
            wishlist.getRoles().remove(email);
            saveWishlist(wishlist);
            return ResponseEntity.ok("Collaborator removed");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    private Wishlist getWishlistById(String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        return db.collection("wishlists").document(id).get().get().toObject(Wishlist.class);
    }

    private void saveWishlist(Wishlist wishlist) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        db.collection("wishlists").document(wishlist.getId()).set(wishlist).get();
    }
}










//package com.flockshop.wishlist_backend.controller;
//
//import com.flockshop.wishlist_backend.model.ProductItem;
//import com.flockshop.wishlist_backend.model.Wishlist;
//import com.flockshop.wishlist_backend.service.WishlistService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import com.flockshop.wishlist_backend.model.Wishlist;
//import com.google.cloud.firestore.Firestore;
//import com.google.cloud.firestore.FirestoreOptions;
//import com.google.cloud.firestore.QueryDocumentSnapshot;
//import com.google.firebase.cloud.FirestoreClient;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/wishlists")
//@CrossOrigin(origins = "*") 
//public class WishlistController {
//
//    @Autowired
//    private WishlistService wishlistService;
//
//    // Create new wishlist
//    @PostMapping
//    public ResponseEntity<String> createWishlist(@RequestBody Wishlist wishlist) {
//        try {
//            String id = wishlistService.createWishlist(wishlist);
//            return ResponseEntity.ok(id);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Error: " + e.getMessage());
//        }
//    }
//
//    // Get wishlist by ID
//    @GetMapping("/{id}")
//    public ResponseEntity<?> getWishlist(@PathVariable String id) {
//        try {
//            Wishlist wishlist = wishlistService.getWishlist(id);
//            return ResponseEntity.ok(wishlist);
//        } catch (Exception e) {
//            return ResponseEntity.status(404).body("Wishlist not found");
//        }
//    }
//    @GetMapping("/user/{email}")
//    public ResponseEntity<List<Wishlist>> getWishlistsByUser(@PathVariable String email) {
//        try {
//            Firestore db = FirestoreClient.getFirestore();
//            List<Wishlist> result = db.collection("wishlists")
//                    .whereEqualTo("createdBy", email)
//                    .get()
//                    .get()
//                    .getDocuments()
//                    .stream()
//                    .map(doc -> doc.toObject(Wishlist.class))
//                    .collect(Collectors.toList());
//
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {
//            e.printStackTrace(); // optional: log the error
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
//
//
//    // Add product to wishlist
//    @PostMapping("/{id}/items")
//    public ResponseEntity<String> addItem(
//            @PathVariable String id,
//            @RequestBody ProductItem item
//    ) {
//        try {
//            wishlistService.addProductToWishlist(id, item);
//            return ResponseEntity.ok("Item added");
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Error: " + e.getMessage());
//        }
//    }
//
//    // Delete product from wishlist
//    @DeleteMapping("/{id}/items/{itemId}")
//    public ResponseEntity<String> deleteItem(
//            @PathVariable String id,
//            @PathVariable String itemId
//    ) {
//        try {
//            wishlistService.removeProduct(id, itemId);
//            return ResponseEntity.ok("Item removed");
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Error: " + e.getMessage());
//        }
//    }
//    
//}

package com.flockshop.wishlist_backend.service;

import com.flockshop.wishlist_backend.model.ProductItem;
import com.flockshop.wishlist_backend.model.Wishlist;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class WishlistService {

    private Firestore getDb() {
        return FirestoreClient.getFirestore();
    }

    public String createWishlist(Wishlist wishlist) throws Exception {
    	System.out.println("Creating wishlist: " + wishlist.getName() + ", by: " + wishlist.getCreatedBy());
    	wishlist.setRoles(Map.of(wishlist.getCreatedBy(), "owner"));
        Firestore db = getDb();
        DocumentReference docRef = db.collection("wishlists").document();
        wishlist.setId(docRef.getId());
        System.out.println("Document ID set: " + wishlist.getId());
        ApiFuture<WriteResult> future = docRef.set(wishlist);
        WriteResult result = future.get();
        System.out.println("Wishlist written at: " + result.getUpdateTime());
        return docRef.getId();
    }

    public Wishlist getWishlist(String id) throws Exception {
        Firestore db = getDb();
        DocumentSnapshot snapshot = db.collection("wishlists").document(id).get().get();
        if (snapshot.exists()) {
            return snapshot.toObject(Wishlist.class);
        } else {
            throw new Exception("Wishlist not found");
        }
    }

    public void addProductToWishlist(String wishlistId, ProductItem item) throws Exception {
        Firestore db = getDb();
        Wishlist wishlist = getWishlist(wishlistId);
        item.setId(UUID.randomUUID().toString());
        wishlist.getItems().add(item);
        db.collection("wishlists").document(wishlistId).set(wishlist);
    }

    public void removeProduct(String wishlistId, String itemId) throws Exception {
        Firestore db = getDb();
        Wishlist wishlist = getWishlist(wishlistId);
        List<ProductItem> items = wishlist.getItems();
        items.removeIf(product -> product.getId().equals(itemId));
        wishlist.setItems(items);
        db.collection("wishlists").document(wishlistId).set(wishlist);
    }
}

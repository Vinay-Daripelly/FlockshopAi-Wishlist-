package com.flockshop.wishlist_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Wishlist {
    public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public List<ProductItem> getItems() {
		return items;
	}
	public void setItems(List<ProductItem> items) {
		this.items = items;
	}
	private String id;
    private String name;
    private String createdBy; 
    private Map<String, String> roles= new HashMap<>(); // email -> "owner", "editor", "viewer"
    public Map<String, String> getRoles() {
		return roles;
	}
	public void setRoles(Map<String, String> roles) {
		this.roles = roles;
	}
	private List<ProductItem> items = new ArrayList<>();
	public String getCreatedBy() {
		// TODO Auto-generated method stub
		return createdBy;
	}
}

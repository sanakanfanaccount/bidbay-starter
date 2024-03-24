<script setup>
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const { isAuthenticated, token } = useAuthStore();
const router = useRouter();

const error = ref(null);
const isLoading = ref(false);

if (!isAuthenticated.value) {
  router.push({ name: "Login" });
}

async function addProduct(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const productName = formData.get('productName');
  const productDescription = formData.get('description');
  const productCategory = formData.get('category');
  const productOriginalPrice = formData.get('originalPrice');
  const productPictureUrl = formData.get('pictureUrl');
  const productEndDate = formData.get('endDate');

  isLoading.value = true;
  error.value = null;

  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        "name": productName,
        "description": productDescription,
        "pictureUrl": productPictureUrl,
        "category": productCategory,
        "originalPrice": productOriginalPrice,
        "endDate": productEndDate
      }),
    });

	


    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }else{
      const product = await response.json();
      router.push({ name: "Product", params: { productId: product.id } });
    }

  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <h1 class="text-center">Ajouter un produit</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form @submit="addProduct">
        <div v-if="error" class="alert alert-danger mt-4" role="alert" data-test-error>
          {{ error }}
        </div>

        <div class="mb-3">
          <label for="productName" class="form-label"> Nom du produit </label>
          <input
            type="text"
            class="form-control"
            id="productName"
            name="productName"
            required
            data-test-product-name
          />
        </div>

        <div class="mb-3">
          <label for="productDescription" class="form-label">
            Description
          </label>
          <textarea
            class="form-control"
            id="productDescription"
            name="description"
            rows="3"
            required
            data-test-product-description
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="product-category" class="form-label"> 
            Catégorie 
          </label>
          <input
            type="text"
            class="form-control"
            name="category"
            id="product-category"
            required
            data-test-product-category
          />
        </div>

        <div class="mb-3">
          <label for="product-original-price" class="form-label">
            Prix de départ
          </label>
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              id="product-original-price"
              name="originalPrice"
              step="1"
              min="0"
              required
              data-test-product-price
            />
            <span class="input-group-text">€</span>
          </div>
        </div>

        <div class="mb-3">
          <label for="product-picture-url" class="form-label">
            URL de l'image
          </label>
          <input
            type="url"
            class="form-control"
            id="product-picture-url"
            name="pictureUrl"
            required
            data-test-product-picture
          />
        </div>

        <div class="mb-3">
          <label for="product-end-date" class="form-label">
            Date de fin de l'enchère
          </label>
          <input
            type="date"
            class="form-control"
            id="product-end-date"
            name="endDate"
            required
            data-test-product-end-date
          />
        </div>

        <div class="d-grid gap-2">
          <button
  type="submit"
  class="btn btn-primary"
  :disabled="isLoading"
  data-test-submit
>
  Ajouter le produit
  <span v-if="isLoading"
    data-test-spinner
    class="spinner-border spinner-border-sm"
    role="status"
    aria-hidden="true"
  ></span>
</button>
        </div>
      </form>
    </div>
  </div>
</template>

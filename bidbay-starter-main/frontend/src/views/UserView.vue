<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../store/auth";

const { isAuthenticated, isAdmin } = useAuthStore();

const user = ref({});
const bids = ref([]);
const router = useRouter();
const route = useRoute();

const loading = ref(true);
const error = ref(false);

let userId = computed(() => route.params.userId);

/**
 * @param {Date} date
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};


async function fetchData(link) {
  try {
    const response = await fetch("http://localhost:3000/api/users/" + link);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    } else {
      user.value = data;
      bids.value = data.bids;
    }
  } catch (e) {
    error.value = true;
    console.error("Une erreur est survenue lors du chargement des données :", e);
  } finally {
    loading.value = false;
  }
}

fetchData(userId.value);

</script>

<template>
  <div>
    <h1 class="text-center" data-test-username>
      Utilisateur {{user.username}}
      <span v-if="isAdmin" class="badge rounded-pill bg-primary" data-test-admin>Admin</span>
    </h1>
    <div v-if="loading" class="text-center" data-test-loading>
      <span class="spinner-border"></span>
      <span>Chargement en cours...</span>
    </div>
    <div v-if="error" class="alert alert-danger mt-3" data-test-error>
      Une erreur est survenue
    </div>
    <div data-test-view>
      <div class="row">
        <div class="col-lg-6">
          <h2>Produits</h2>
          <div class="row">
            <div
              class="col-md-6 mb-6 py-2"
              v-for="product in user.products"
              :key="i"
              data-test-product
            >
              <div class="card">
                <RouterLink
                  :to="{ name: 'Product', params: { productId: product.id } }"
                >
                  <img
                    :src="product.pictureUrl"
                    class="card-img-top"
                    data-test-product-picture
                  />
                </RouterLink>
                <div class="card-body">
                  <h5 class="card-title">
                    <RouterLink
                      :to="{
                        name: 'Product',
                        params: { productId: product.id },
                      }"
                      data-test-product-name
                    >
                    {{product.name}}
                    </RouterLink>
                  </h5>
                  <p class="card-text" data-test-product-description>
                    {{ product.description }}
                  </p>
                  <p class="card-text" data-test-product-price>
                    Prix de départ : {{ product.originalPrice }} €
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <h2>Offres</h2>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Offre</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bid in bids" data-test-bid>
                <td>
                  <RouterLink
                    :to="{
                      name: 'Product',
                      params: { productId: bid.product.id },
                    }"
                    data-test-bid-product
                  >
                    {{bid.product.name}}
                  </RouterLink>
                </td>
                <td data-test-bid-price>{{ bid.price }} €</td>
                <td data-test-bid-date>{{ formatDate(bid.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

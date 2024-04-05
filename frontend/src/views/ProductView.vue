<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

import { useAuthStore } from "../store/auth";

const { isAuthenticated, isAdmin, userData } = useAuthStore();

const route = useRoute();
const Product = ref({});
const productId = ref(route.params.productId);
const countdown = ref("");
const bids = ref([]);

const nobids = ref(false);

const loading = ref(false);
const error = ref(false);

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options);
}


async function fetchProducts(link) {
  try {
    loading.value = true;
    const response = await fetch("http://localhost:3000/api/products/" + link);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    } else {
      Product.value = data;
      if (data.bids) {
        bids.value = data.bids;
        const bidderNames = await Promise.all(data.bids.map(bid => fetchName(bid.bidderId)));
        bidderNames.forEach((name, index) => {
          bids.value[index].bidderName = name;
        });
        if (bids.value.length < 1) {
          nobids.value = true;
        }
        console.error(bids.value.length);
      }
      updateCountdown(data.endDate);
    }
  } catch (e) {
    error.value = true;
    console.error("Une erreur est survenue lors du chargement des données :", e);
  } finally {
    loading.value = false;
  }
}

async function fetchName(link) {
  try {
    const response = await fetch("http://localhost:3000/api/users/" + link);
    const data = await response.json();
    return(data.username);
  } catch (e) {
    error.value = true;
    console.error("Une erreur est survenue lors du chargement des données :", e);
  }
}

function calculateTimeDifference(endDate) {
  const now = new Date();
  const difference = new Date(endDate) - now;
  if(difference <= 0){return 0}else{
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}
}

function updateCountdown(endDate) {
  setInterval(() => {
    const timeDifference = calculateTimeDifference(endDate);
    if(timeDifference == 0){countdown.value = "Expiré"}else{
    countdown.value = `${timeDifference.days}j, ${timeDifference.hours}h, ${timeDifference.minutes}h, ${timeDifference.seconds}s`;
  }
  }, 1000);
}

fetchProducts(productId.value);


</script>


<template>
  

  <div v-if="!error || !loading" class="row">
    <div v-if="loading" class="text-center mt-4" data-test-loading>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mt-4" role="alert" data-test-error>
      Une erreur est survenue lors du chargement des produits.
    </div>
    <div v-if="!loading && !error" class="row" data-test-product>
      <!-- Colonne de gauche : image et compte à rebours -->
      <div class="col-lg-4">
        <img
          :src="Product.pictureUrl"
          alt=""
          class="img-fluid rounded mb-3"
          data-test-product-picture
        />
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Compte à rebours</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted" data-test-countdown>
              Temps restant : {{ countdown }}
            </h6>
          </div>
        </div>
      </div>

      <!-- Colonne de droite : informations du produit et formulaire d'enchère -->
      <div class="col-lg-8">
        <div class="row">
          <div class="col-lg-6">
            <h1 class="mb-3" data-test-product-name>
              {{Product.name}}
            </h1>
          </div>
          <div class="col-lg-6 text-end">
            <RouterLink
              :to="{ name: 'ProductEdition', params: { productId: Product.id } }"
              class="btn btn-primary"
              data-test-edit-product
            >
              Editer
            </RouterLink>
            &nbsp;
            <button class="btn btn-danger" data-test-delete-product>
              Supprimer
            </button>
          </div>
        </div>

        <h2 class="mb-3">Description</h2>
        <p data-test-product-description>
          {{Product.description}}
        </p>

        <h2 class="mb-3">Informations sur l'enchère</h2>
        <ul>
          <li data-test-product-price>Prix de départ : {{Product.originalPrice}} €</li>
          <li data-test-product-end-date>Date de fin : {{formatDate(Product.endDate)}}</li>
          <li>
            Vendeur :
            <router-link v-if="Product.seller"
            :to="{ name: 'User', params: { userId: Product.seller.id } }"
            data-test-product-seller>
              {{ Product.seller.username }}
            </router-link>
          </li>
        </ul>

        <h2 class="mb-3">Offres sur le produit</h2>
        <table class="table table-striped" data-test-bids>
          <thead>
            <tr>
              <th scope="col">Enchérisseur</th>
              <th scope="col">Offre</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(bid, index) in bids" :key="index" data-test-bid>
              <td>
                <router-link
                  :to="{ name: 'User', params: { userId: bid.bidderId } }"
                  data-test-bid-bidder>
                    {{ bid.bidderName }}
                </router-link>
              </td>
              <td data-test-bid-price>{{ bid.price }} €</td>
              <td data-test-bid-date>{{ formatDate(bid.date) }}</td>
            <td>
            <button class="btn btn-danger btn-sm" data-test-delete-bid>
              Supprimer
            </button>
            </td>
            </tr>
          </tbody>
        </table>
        <p v-if="nobids && !loading" data-test-no-bids>Aucune offre pour le moment</p>


        <form data-test-bid-form>
          <div class="form-group">
            <label for="bidAmount">Votre offre :</label>
            <input
              type="number"
              class="form-control"
              id="bidAmount"
              data-test-bid-form-price
            />
            <small class="form-text text-muted">
              Le montant doit être supérieur à 10 €.
            </small>
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            disabled
            data-test-submit-bid
          >
            Enchérir
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

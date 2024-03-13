import { computed, ref, watch } from "vue";
import { jwtDecode } from "jwt-decode";

const token = ref(localStorage.getItem("token") || null);

try {
  jwtDecode(token.value);
} catch {
  token.value = null;
}

const userData = computed(() => {
  if (!token.value) return null;
  return jwtDecode(token.value);
});

watch(token, () => {
  if (token.value) {
    localStorage.setItem("token", token.value);
  } else {
    localStorage.removeItem("token");
  }
});

const isAuthenticated = computed(() => userData.value !== null);

const isAdmin = computed(() => userData.value !== null && userData.value.admin);

const username = computed(() => userData.value.username);

export function useAuthStore() {
  return {
    userData,
    token,
    isAuthenticated,
    isAdmin,
    username,
    login,
    logout,
  };
}

function login(_token) {
  token.value = _token;
}

function logout() {
  token.value = null;
}

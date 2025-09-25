<template>
  <div class="account-error">
    <h2>Account not found</h2>
    <p>
      You don't have access to any account or the account you're trying to
      access doesn't exist.
    </p>
    <p>Please contact support if you believe this is an error.</p>
    <button @click="goToHome">Go to home page</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { useSimpleAccountError } from "../composables/useSimpleAccountError";

const router = useRouter();
const { clearError } = useSimpleAccountError();

const goToHome = () => {
  clearError();
  router.push("/");
};
</script>

<style scoped>
.account-error {
  text-align: center;
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.account-error h2 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.account-error p {
  margin-bottom: 1rem;
  color: #666;
}

.account-error button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.account-error button:hover {
  background: #0056b3;
}
</style>

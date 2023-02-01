<script setup lang="ts">
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ref } from 'vue';
import TrackerForm from '@/components/TrackerForm.vue';

// <<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>>
// ----------------8<-------------[ GOOGLE AUTHENTICATION ]--------------------
// <<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>><<>>
const isLoggedIn = ref(false);
const provider = new GoogleAuthProvider();

const error = ref('');

const auth = getAuth();
onAuthStateChanged(auth, user => {
  if (user !== null) {
    isLoggedIn.value = true;
    return;
  }
  isLoggedIn.value = false;
});

function authenticate() {
  signInWithPopup(auth, provider)
    .then(() => {
      console.log('Login successful');
    })
    .catch(error => {
      error.value = 'Error logging in: ' + error;
    });
}
</script>

<template>
  <div v-if="!isLoggedIn" class="my-4 mx-4">
    <div class="text-center">
      <button class="inline-flex gap-1 items-center" @click="authenticate">
        <span>Login</span> <span class="material-symbols-outlined">login</span>
      </button>
      <p class="text-red-500">{{ error }}</p>
    </div>
  </div>
  <div v-else>
    <TrackerForm />
  </div>
</template>

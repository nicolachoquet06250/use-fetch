<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<script setup lang="ts">
  import HelloWorld from './components/HelloWorld.vue';
  import { useFetch } from './hooks/use-fetch';

  const { fetch: fetchGet } = useFetch('http://localhost:8080/api/v1/users', {
      method: 'get'
  });

  const { fetch: fetchPost } = useFetch('/users', {
      method: 'post',
      headers: {
        "Content-Type": 'application/json'
      }
  });

  fetchGet().then(r => {
    const user = r[0];
    return user.id;
  });

  fetchPost({ id: 1 }).then(r => r.id);
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

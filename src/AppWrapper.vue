<template>
  <router-view />
</template>

<script>
export default {
  name: 'AppWrapper'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  color: #333;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>

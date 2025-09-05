<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <AIChatbot />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import AIChatbot from './components/AIChatbot.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    AIChatbot
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 1rem 0;
}
</style>

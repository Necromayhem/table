<script setup lang="ts">
import MenuBar from './components/MenuBar.vue'
</script>

<template>
	<div class="menubar">
		<MenuBar />
	</div>
	<router-view></router-view>
</template>

<style scoped>
.menubar {
	margin-bottom: 20px;
}
</style>

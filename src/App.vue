<script setup>
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
	margin-bottom: 40px;
}
</style>

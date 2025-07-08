<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menubar } from 'primevue'

const router = useRouter()
const route = useRoute()

const activeIndex = computed(() => {
	return route.path.startsWith('/users')
		? 0
		: route.path.startsWith('/favorites')
			? 1
			: 0
})

const items = ref([
	{
		label: 'Пользователи',
		icon: 'pi pi-home',
		command: () => {
			router.push('/users')
		},
		class: computed(() => (activeIndex.value === 0 ? 'p-menuitem-active' : '')),
	},
	{
		label: 'Избранное',
		icon: 'pi pi-star',
		command: () => {
			router.push('/favorites')
		},
		class: computed(() => (activeIndex.value === 1 ? 'p-menuitem-active' : '')),
	},
])
</script>

<template>
	<div class="card">
		<Menubar :model="items" class="justify-content-center" />
	</div>
</template>

<style scoped>
:deep(.p-menubar-item .p-menubar-item-label),
:deep(.p-menubar-item .p-menubar-item-icon) {
	color: inherit !important;
}

:deep(.p-menubar-item.p-menuitem-active .p-menubar-item-label),
:deep(.p-menubar-item.p-menuitem-active .p-menubar-item-icon) {
	color: rgb(161, 225, 187) !important;
}

:deep(.p-menubar-item .p-menubar-item-content) {
	background: transparent !important;
}

:deep(.p-menubar-item .p-menubar-item-content:focus) {
	box-shadow: none !important;
	outline: none !important;
}
</style>

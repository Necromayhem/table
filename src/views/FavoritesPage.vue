<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import Card from 'primevue/card'
import Button from 'primevue/button'

const favoritesStore = useFavoritesStore()

const favoriteUsers = computed(() => favoritesStore.favoriteUsers)
</script>

<template>
	<div class="p-4">
		<div v-if="favoriteUsers.length === 0" class="text-gray-500 text-center">
			Нет пользователей в избранном
		</div>

		<div v-else class="flex justify-center">
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-fit mx-auto">
				<Card
					v-for="user in favoriteUsers"
					:key="user.id"
					class="p-4 shadow-md hover:shadow-lg transition-shadow w-80"
				>
					<template #title>
						<h3 class="text-xl font-semibold">{{ user.name }}</h3>
					</template>

					<template #content>
						<div class="space-y-3">
							<p class="flex flex-col">
								<span class="font-semibold">Email:&nbsp;</span>
								<span class="text-gray-700">{{ user.email }}</span>
							</p>

							<p class="flex flex-col">
								<span class="font-semibold">Phone:&nbsp;</span>
								<span class="text-gray-700">{{ user.phone }}</span>
							</p>

							<p class="flex flex-col">
								<span class="font-semibold">Address:&nbsp;</span>
								<span class="text-gray-700"
									>{{ user.address.street }}, {{ user.address.city }}</span
								>
							</p>

							<p class="flex flex-col">
								<span class="font-semibold">Company:&nbsp;</span>
								<span class="text-gray-700">{{ user.company.name }}</span>
							</p>

							<p class="flex flex-col">
								<span class="font-semibold">Website:&nbsp;</span>
								<a
									:href="'https://' + user.website"
									target="_blank"
									class="text-gray-700 hover:text-gray-900 no-underline"
								>
									{{ user.website }}
								</a>
							</p>
						</div>

						<div class="mt-4">
							<Button
								@click="() => favoritesStore.removeFromFavorites(user)"
								label="Удалить из избранного"
								class="p-button-text p-button-danger"
								icon="pi pi-trash"
							/>
						</div>
					</template>
				</Card>
			</div>
		</div>
	</div>
</template>

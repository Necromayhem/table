<script setup lang="ts">
import { ref, computed } from 'vue'
import useUsers from '../composables/useUsers'
import { API_URLS } from '../constants/api'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

const { users, toggleFavorite } = useUsers(API_URLS.USERS)

const favoriteUsers = computed(() =>
	users.value.filter(user => user.isFavorite)
)
</script>

<template>
	<div class="p-4">
		<h2 class="text-2xl font-bold mb-6">Страница избранного</h2>

		<div v-if="favoriteUsers.length === 0" class="text-gray-500">
			Нет пользователей в избранном
		</div>

		<div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			<Card
				v-for="user in favoriteUsers"
				:key="user.id"
				class="p-4 shadow-md hover:shadow-lg transition-shadow"
			>
				<template #title>
					<div class="flex justify-between items-center">
						<h3 class="text-xl font-semibold">{{ user.name }}</h3>
						<Button
							icon="pi pi-star-fill"
							severity="success"
							@click="toggleFavorite(user)"
							text
							rounded
						/>
					</div>
				</template>

				<template #content>
					<div class="space-y-2">
						<p><span class="font-medium">Email:</span> {{ user.email }}</p>
						<p><span class="font-medium">Phone:</span> {{ user.phone }}</p>
						<p>
							<span class="font-medium">Address:</span>
							{{ user.address.street }}
						</p>
						<p>
							<span class="font-medium">Company:</span> {{ user.company.name }}
						</p>
					</div>

					<div class="mt-4 flex items-center">
						<Checkbox
							:binary="true"
							:modelValue="true"
							@change="() => toggleFavorite(user)"
						/>
						<span class="ml-2">Удалить из избранного</span>
					</div>
				</template>
			</Card>
		</div>
	</div>
</template>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/composables/useUsers'

export const useFavoritesStore = defineStore('favorites', () => {
	const favoriteUsers = ref<User[]>([])

	const addToFavorites = (user: User) => {
		if (!favoriteUsers.value.some(fav => fav.id === user.id)) {
			favoriteUsers.value.push({ ...user, isFavorite: true })
		}
	}

	const removeFromFavorites = (user: User) => {
		favoriteUsers.value = favoriteUsers.value.filter(fav => fav.id !== user.id)
	}

	const toggleFavorite = (user: User) => {
		const isFavorite = favoriteUsers.value.some(fav => fav.id === user.id)
		if (isFavorite) {
			removeFromFavorites(user)
		} else {
			addToFavorites(user)
		}
		return !isFavorite
	}

	const isFavorite = (userId: number) => {
		return favoriteUsers.value.some(user => user.id === userId)
	}

	return {
		favoriteUsers,
		addToFavorites,
		removeFromFavorites,
		toggleFavorite,
		isFavorite,
	}
})

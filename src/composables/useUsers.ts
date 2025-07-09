import { ref, watchEffect, toValue } from 'vue'
import axios from 'axios'
import { useFavoritesStore } from '@/stores/favorites'
import { useUsersCacheStore } from '@/stores/usersCache'

export interface User {
	id: number
	name: string
	email: string
	address: {
		street: string
		suite?: string
		city: string
		zipcode?: string
		[key: string]: any
	}
	phone: string
	website: string
	company: {
		name: string
		catchPhrase?: string
		bs?: string
		[key: string]: any
	}
	isFavorite?: boolean
}

export default function useUsers(url: string | (() => string)) {
	const users = ref<User[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)
	const favoritesStore = useFavoritesStore()
	const usersCacheStore = useUsersCacheStore()

	const fetchUsers = async (forceFetch = false) => {
		try {
			loading.value = true
			error.value = null

			if (!forceFetch && usersCacheStore.isCacheValid()) {
				users.value = usersCacheStore.getUsers().map(user => ({
					...user,
					isFavorite: favoritesStore.isFavorite(user.id),
				}))
				return
			}

			const apiUrl = toValue(url)
			const response = await axios.get<User[]>(apiUrl)

			usersCacheStore.setUsers(response.data)

			users.value = response.data.map(user => ({
				...user,
				isFavorite: favoritesStore.isFavorite(user.id),
			}))
		} catch (err) {
			error.value = 'Failed to fetch users'
			console.error('Error fetching users:', err)

			if (usersCacheStore.cachedUsers.length > 0) {
				users.value = usersCacheStore.getUsers().map(user => ({
					...user,
					isFavorite: favoritesStore.isFavorite(user.id),
				}))
			} else {
				users.value = []
			}
		} finally {
			loading.value = false
		}
	}

	const refreshUsers = () => {
		fetchUsers(true)
	}

	watchEffect(() => {
		fetchUsers()
	})

	const toggleFavorite = (user: User) => {
		const newFavoriteState = favoritesStore.toggleFavorite(user)
		user.isFavorite = newFavoriteState
	}

	return {
		users,
		loading,
		error,
		toggleFavorite,
		refreshUsers,
	}
}

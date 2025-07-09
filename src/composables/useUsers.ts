import { ref, onMounted } from 'vue'
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
	const backgroundLoading = ref(false)
	const error = ref<string | null>(null)
	const favoritesStore = useFavoritesStore()
	const usersCacheStore = useUsersCacheStore()

	let currentLoadPromise: Promise<void> | null = null

	const applyFavorites = (usersList: User[]) => {
		return usersList.map(user => ({
			...user,
			isFavorite: favoritesStore.isFavorite(user.id),
		}))
	}

	const fetchUsers = async (forceFetch = false, background = false) => {
		if (currentLoadPromise && !forceFetch) {
			return currentLoadPromise
		}

		try {
			if (background) {
				backgroundLoading.value = true
			} else {
				loading.value = true
			}

			const apiUrl = typeof url === 'function' ? url() : url
			currentLoadPromise = axios.get<User[]>(apiUrl).then(async response => {
				const newUsers = response.data
				usersCacheStore.setUsers(newUsers)
				users.value = applyFavorites(newUsers)
			})

			await currentLoadPromise
		} catch (err) {
			error.value = 'Failed to fetch users'
			console.error('Error fetching users:', err)
		} finally {
			loading.value = false
			backgroundLoading.value = false
			currentLoadPromise = null
		}
	}

	const loadInitialData = async () => {
		const cachedUsers = usersCacheStore.getUsers()
		if (cachedUsers.length > 0) {
			users.value = applyFavorites(cachedUsers)
		}

		if (cachedUsers.length === 0 || usersCacheStore.isCacheTooOld()) {
			await fetchUsers(false, cachedUsers.length > 0)
		} else if (!usersCacheStore.isCacheValid()) {
			fetchUsers(false, true)
		}
	}

	const refreshUsers = () => {
		fetchUsers(true)
	}

	onMounted(() => {
		loadInitialData()
	})

	const toggleFavorite = (user: User) => {
		const newFavoriteState = favoritesStore.toggleFavorite(user)
		user.isFavorite = newFavoriteState
	}

	return {
		users,
		loading,
		backgroundLoading,
		error,
		toggleFavorite,
		refreshUsers,
	}
}

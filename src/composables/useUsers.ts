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
	const showLoadingIndicator = ref(false)

	const applyFavorites = (usersList: User[]) => {
		return usersList.map(user => ({
			...user,
			isFavorite: favoritesStore.isFavorite(user.id),
		}))
	}

	const fetchUsers = async (forceFetch = false) => {
		try {
			const cachedUsers = usersCacheStore.getUsers()

			showLoadingIndicator.value = cachedUsers.length === 0 || forceFetch

			if (cachedUsers.length > 0 && !forceFetch) {
				users.value = applyFavorites(cachedUsers)
			}

			const needUpdate =
				forceFetch ||
				!usersCacheStore.isCacheValid() ||
				usersCacheStore.isCacheTooOld()

			if (!needUpdate) {
				showLoadingIndicator.value = false
				return
			}

			if (showLoadingIndicator.value) {
				loading.value = true
			} else {
				backgroundLoading.value = true
			}

			const apiUrl = typeof url === 'function' ? url() : url
			const response = await axios.get<User[]>(apiUrl)

			const newUsers = response.data
			const dataChanged =
				JSON.stringify(cachedUsers) !== JSON.stringify(newUsers)

			if (dataChanged || forceFetch) {
				usersCacheStore.setUsers(newUsers)
				users.value = applyFavorites(newUsers)
			}
		} catch (err) {
			error.value = 'Failed to fetch users'
			console.error('Error fetching users:', err)
		} finally {
			loading.value = false
			backgroundLoading.value = false
			showLoadingIndicator.value = false
		}
	}

	const refreshUsers = () => {
		fetchUsers(true)
	}

	onMounted(() => {
		fetchUsers()
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
		showLoadingIndicator,
		toggleFavorite,
		refreshUsers,
	}
}

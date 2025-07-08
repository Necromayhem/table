import { ref, watchEffect, toValue } from 'vue'
import axios from 'axios'

export interface User {
	id: number
	name: string
	email: string
	address: {
		street: string
		[key: string]: any
	}
	phone: string
	company: {
		name: string
		[key: string]: any
	}
	isFavorite?: boolean
}

export default function useUsers(url: string | (() => string)) {
	const users = ref<User[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)

	const fetchUsers = async () => {
		try {
			loading.value = true
			error.value = null
			const apiUrl = toValue(url)
			const response = await axios.get<User[]>(apiUrl)
			users.value = response.data.map(user => ({ ...user, isFavorite: false }))
		} catch (err) {
			error.value = 'Failed to fetch users'
			console.error('Error fetching users:', err)
		} finally {
			loading.value = false
		}
	}

	watchEffect(() => {
		fetchUsers()
	})

	const toggleFavorite = (user: User) => {
		user.isFavorite = !user.isFavorite
	}

	return {
		users,
		loading,
		error,
		toggleFavorite,
	}
}

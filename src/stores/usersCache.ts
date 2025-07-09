import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { User } from '@/composables/useUsers'

export const useUsersCacheStore = defineStore('usersCache', () => {
	const cachedUsers = useStorage<User[]>('cachedUsers', [])
	const lastFetchTime = useStorage<number>('lastFetchTime', 0)
	const cacheDuration = 5 * 60 * 1000

	const setUsers = (users: User[]) => {
		cachedUsers.value = users
		lastFetchTime.value = Date.now()
	}

	const getUsers = () => {
		return cachedUsers.value
	}

	const isCacheValid = () => {
		if (cachedUsers.value.length === 0) return false
		return Date.now() - lastFetchTime.value < cacheDuration
	}

	const clearCache = () => {
		cachedUsers.value = []
		lastFetchTime.value = 0
	}

	return {
		cachedUsers,
		lastFetchTime,
		setUsers,
		getUsers,
		isCacheValid,
		clearCache,
	}
})

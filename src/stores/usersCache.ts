import { defineStore } from 'pinia'
import type { User } from '@/composables/useUsers'

export const useUsersCacheStore = defineStore('usersCache', () => {
	const CACHE_KEY = 'cachedUsers'
	const TIMESTAMP_KEY = 'lastFetchTime'
	const CACHE_DURATION = 5 * 60 * 1000

	const getUsers = (): User[] => {
		const stored = localStorage.getItem(CACHE_KEY)
		return stored ? JSON.parse(stored) : []
	}

	const setUsers = (users: User[]) => {
		localStorage.setItem(CACHE_KEY, JSON.stringify(users))
		localStorage.setItem(TIMESTAMP_KEY, Date.now().toString())
	}

	const getLastFetchTime = (): number => {
		const stored = localStorage.getItem(TIMESTAMP_KEY)
		return stored ? parseInt(stored) : 0
	}

	const isCacheValid = (): boolean => {
		const lastFetch = getLastFetchTime()
		if (lastFetch === 0) return false

		const cacheAge = Date.now() - lastFetch
		return cacheAge < CACHE_DURATION
	}

	const isCacheTooOld = (): boolean => {
		const lastFetch = getLastFetchTime()
		if (lastFetch === 0) return true

		const cacheAge = Date.now() - lastFetch
		return cacheAge > CACHE_DURATION * 2
	}

	const clearCache = () => {
		localStorage.removeItem(CACHE_KEY)
		localStorage.removeItem(TIMESTAMP_KEY)
	}

	return {
		getUsers,
		setUsers,
		getLastFetchTime,
		isCacheValid,
		isCacheTooOld,
		clearCache,
	}
})

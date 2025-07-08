import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/users',
			component: () => import('../views/UsersPage.vue'),
		},
		{
			path: '/favorites',
			component: () => import('../views/FavoritesPage.vue'),
		},
		{
			path: '/',
			redirect: '/users',
		},
	],
})

export default router

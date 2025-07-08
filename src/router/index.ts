import { createRouter, createWebHistory } from 'vue-router'
import UsersPage from '../views/UsersPage.vue'
import FavoritesPage from '../views/FavoritesPage.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/users', component: UsersPage },
		{ path: '/favorites', component: FavoritesPage },
		{ path: '/', redirect: '/users' },
	],
})

export default router

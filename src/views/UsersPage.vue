<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import useUsers from '../composables/useUsers'
import { API_URLS } from '../constants/api'

const route = useRoute()
const router = useRouter()
const {
	users,
	toggleFavorite,
	refreshUsers,
	backgroundLoading,
	loading,
	error,
} = useUsers(API_URLS.USERS)

const page = ref(1)
const perPage = ref(10)
const first = computed({
	get: () => (page.value - 1) * perPage.value,
	set: value => {
		page.value = Math.floor(value / perPage.value) + 1
	},
})

onMounted(() => {
	if (!route.query.page || !route.query.perPage) {
		router.push({
			query: {
				...route.query,
				page: page.value,
				perPage: perPage.value,
			},
		})
	} else {
		page.value = Number(route.query.page)
		perPage.value = Number(route.query.perPage)
	}
})

watch([page, perPage], ([newPage, newPerPage]) => {
	router.push({
		query: {
			...route.query,
			page: newPage,
			perPage: newPerPage,
		},
	})
})

watch(
	() => route.query,
	newQuery => {
		if (newQuery.page) {
			page.value = Number(newQuery.page)
		}
		if (newQuery.perPage) {
			perPage.value = Number(newQuery.perPage)
		}
	}
)
</script>

<template>
	<div class="p-4">
		<div v-if="loading" class="loading-indicator text-center">
			<ProgressSpinner />
		</div>

		<div
			v-if="backgroundLoading"
			class="background-loading-indicator text-center"
		>
			<ProgressSpinner />
		</div>

		<div v-else-if="error" class="error-message text-center p-4">
			<div class="text-red-500 font-bold mb-2">
				Произошла ошибка при загрузке данных
			</div>
			<div class="mb-3">{{ error }}</div>
			<Button
				label="Попробовать снова"
				icon="pi pi-refresh"
				@click="refreshUsers"
			/>
		</div>

		<div
			v-else-if="users.length > 0"
			class="card"
			:class="{ 'opacity-50': backgroundLoading }"
		>
			<DataTable
				:value="users"
				stripedRows
				paginator
				v-model:first="first"
				v-model:rows="perPage"
				:rowsPerPageOptions="[5, 10, 25, 50]"
				tableStyle="min-width: 50rem"
			>
				<Column field="id" header="ID" sortable style="width: 100px"></Column>
				<Column
					field="name"
					header="Name"
					sortable
					style="width: 200px"
				></Column>
				<Column
					field="email"
					header="Email"
					sortable
					style="width: 250px"
				></Column>
				<Column
					field="address.street"
					header="Street"
					sortable
					style="width: 200px"
				></Column>
				<Column
					field="phone"
					header="Phone"
					sortable
					style="width: 150px"
				></Column>
				<Column
					field="company.name"
					header="Company"
					sortable
					style="width: 200px"
				></Column>
				<Column style="width: 150px">
					<template #body="{ data }">
						<Button
							:icon="data.isFavorite ? 'pi pi-star-fill' : 'pi pi-star'"
							:severity="data.isFavorite ? 'success' : 'contrast'"
							@click="toggleFavorite(data)"
							:label="data.isFavorite ? 'В избранном' : 'В избранное'"
						/>
					</template>
				</Column>
			</DataTable>
		</div>
	</div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
	background-color: #f8f9fa;
	font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
	background-color: #e9ecef;
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
	background-color: #f8f9fa;
}

:deep(.p-button) {
	white-space: nowrap;
	min-width: 140px;
}
</style>

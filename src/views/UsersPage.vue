<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import useUsers from '../composables/useUsers'
import { API_URLS } from '../constants/api'

const { users, loading, error, toggleFavorite } = useUsers(API_URLS.USERS)
</script>

<template>
	<div class="p-4">
		<div v-if="loading">Loading users...</div>
		<div v-else-if="error" class="text-red-500">{{ error }}</div>
		<div v-else class="card">
			<DataTable
				:value="users"
				stripedRows
				paginator
				:rows="10"
				:rowsPerPageOptions="[5, 10, 25, 50]"
				tableStyle="min-width: 50rem"
			>
				<Column field="id" header="ID" sortable></Column>
				<Column field="name" header="Name" sortable></Column>
				<Column field="email" header="Email" sortable></Column>
				<Column field="address.street" header="Street" sortable></Column>
				<Column field="phone" header="Phone" sortable></Column>
				<Column field="company.name" header="Company" sortable></Column>
				<Column>
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

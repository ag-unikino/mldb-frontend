<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import RequestDetails from './RequestDetails.vue'
import { getActiveNote, getDistributorById } from '../api/distributors'
import type { FilmRequest, RequestStatus } from '../api/requests'
import { useDateFormat } from '../composables/useDateFormat'
import { useMediaQuery } from '../composables/useMediaQuery'
import { matches } from '../utils/text'

type SortKey = 'date' | 'status' | 'distributor' | 'format' | 'language' | 'cinema'
type SortDirection = 'asc' | 'desc'

const CARD_LAYOUT_QUERY = '(pointer: coarse) and (orientation: portrait) and (max-width: 700px)'

const props = defineProps<{ requests: FilmRequest[] }>()

const { t, locale } = useI18n()
const { formatDate } = useDateFormat()
const isCardLayout = useMediaQuery(CARD_LAYOUT_QUERY)

const statusIcons: Record<RequestStatus, string> = {
  open: '●',
  granted: '✓',
  declined: '✗',
}

const statuses: RequestStatus[] = ['open', 'granted', 'declined']
const statusRank: Record<RequestStatus, number> = { open: 0, granted: 1, declined: 2 }
const sortKeys: SortKey[] = ['date', 'status', 'distributor', 'format', 'language', 'cinema']

const sortKey = ref<SortKey>('date')
const sortDirection = ref<SortDirection>('desc')
const statusFilter = ref<RequestStatus | 'all'>('all')
const distributorFilter = ref('')
const cinemaFilter = ref('')

const expanded = ref(new Set<number>())

function isExpanded(id: number): boolean {
  return expanded.value.has(id)
}

function toggle(id: number) {
  if (expanded.value.has(id)) {
    expanded.value.delete(id)
  } else {
    expanded.value.add(id)
  }
}

function detailsId(id: number): string {
  return 'request-details-' + id
}

function distributorName(id: number): string {
  return getDistributorById(id)?.name ?? '–'
}

function noticeFor(distributorId: number) {
  return getActiveNote(getDistributorById(distributorId))
}

function sortValue(request: FilmRequest, key: SortKey): string | number {
  switch (key) {
    case 'date':
      return request.requestedAt
    case 'status':
      return statusRank[request.status]
    case 'distributor':
      return distributorName(request.distributorId)
    case 'format':
      return t('requests.formats.' + request.format)
    case 'language':
      return request.language
    case 'cinema':
      return request.cinema
  }
}

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), locale.value)
}

const visibleRequests = computed(() => {
  const factor = sortDirection.value === 'asc' ? 1 : -1
  return props.requests
    .filter((request) => statusFilter.value === 'all' || request.status === statusFilter.value)
    .filter((request) => matches(distributorName(request.distributorId), distributorFilter.value))
    .filter((request) => matches(request.cinema, cinemaFilter.value))
    .sort((a, b) => {
      const primary = compareValues(sortValue(a, sortKey.value), sortValue(b, sortKey.value))
      if (primary !== 0) return primary * factor
      return b.requestedAt.localeCompare(a.requestedAt)
    })
})

const hasFilters = computed(
  () =>
    statusFilter.value !== 'all' ||
    distributorFilter.value.trim() !== '' ||
    cinemaFilter.value.trim() !== '',
)

function resetFilters() {
  statusFilter.value = 'all'
  distributorFilter.value = ''
  cinemaFilter.value = ''
}

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

function toggleDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
  if (sortKey.value !== key) return 'none'
  return sortDirection.value === 'asc' ? 'ascending' : 'descending'
}

function sortIndicator(key: SortKey): string {
  if (sortKey.value !== key) return ''
  return sortDirection.value === 'asc' ? '▲' : '▼'
}
</script>

<template>
  <section>
    <h2>{{ t('requests.title') }}</h2>
    <p v-if="requests.length === 0" class="empty">{{ t('requests.empty') }}</p>
    <template v-else>
      <div class="filters">
        <label>
          {{ t('requests.filters.status') }}
          <select v-model="statusFilter">
            <option value="all">{{ t('requests.filters.all') }}</option>
            <option v-for="status in statuses" :key="status" :value="status">
              {{ t('requests.status.' + status) }}
            </option>
          </select>
        </label>
        <label>
          {{ t('requests.filters.distributor') }}
          <input v-model="distributorFilter" type="search" />
        </label>
        <label>
          {{ t('requests.filters.cinema') }}
          <input v-model="cinemaFilter" type="search" />
        </label>
        <button v-if="hasFilters" type="button" class="reset" @click="resetFilters">
          {{ t('requests.filters.reset') }}
        </button>
      </div>
      <div v-if="isCardLayout" class="filters">
        <label>
          {{ t('requests.sortBy') }}
          <select v-model="sortKey">
            <option v-for="key in sortKeys" :key="key" :value="key">
              {{ t('requests.columns.' + key) }}
            </option>
          </select>
        </label>
        <button
          type="button"
          class="reset"
          :aria-label="t('requests.sortDirection')"
          @click="toggleDirection"
        >
          <span aria-hidden="true">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
        </button>
      </div>

      <p v-if="visibleRequests.length === 0" class="empty">{{ t('requests.noMatches') }}</p>

      <ul v-else-if="isCardLayout" class="cards">
        <li v-for="request in visibleRequests" :key="request.id" class="card">
          <div class="card-head">
            <span class="date">{{ formatDate(request.requestedAt) }}</span>
            <span class="status" :class="'status--' + request.status">
              <span aria-hidden="true">{{ statusIcons[request.status] }}</span>
              {{ t('requests.status.' + request.status) }}
            </span>
          </div>
          <p class="card-distributor">
            <RouterLink :to="{ name: 'distributor', params: { id: request.distributorId } }">{{
              distributorName(request.distributorId)
            }}</RouterLink>
            <span
              v-if="noticeFor(request.distributorId)"
              class="notice-marker"
              role="img"
              :aria-label="t('requests.noticeMarker')"
              >⚠</span
            >
          </p>
          <p class="subtle">
            {{ t('requests.formats.' + request.format) }} · {{ request.language }} ·
            {{ request.cinema }}
          </p>
          <button
            type="button"
            class="card-toggle"
            :aria-expanded="isExpanded(request.id)"
            :aria-controls="detailsId(request.id)"
            @click="toggle(request.id)"
          >
            <span aria-hidden="true">{{ isExpanded(request.id) ? '▾' : '▸' }}</span>
            {{ t('requests.columns.details') }}
          </button>
          <div v-show="isExpanded(request.id)" :id="detailsId(request.id)" class="card-details">
            <RequestDetails :request="request" />
          </div>
        </li>
      </ul>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">
                <span class="visually-hidden">{{ t('requests.columns.details') }}</span>
              </th>
              <th v-for="key in sortKeys" :key="key" scope="col" :aria-sort="ariaSort(key)">
                <button type="button" class="sort" @click="setSort(key)">
                  {{ t('requests.columns.' + key) }}
                  <span aria-hidden="true">{{ sortIndicator(key) }}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="request in visibleRequests" :key="request.id">
              <tr>
                <td class="toggle-cell">
                  <button
                    type="button"
                    class="toggle"
                    :aria-expanded="isExpanded(request.id)"
                    :aria-controls="detailsId(request.id)"
                    :aria-label="t('requests.toggle')"
                    @click="toggle(request.id)"
                  >
                    <span aria-hidden="true">{{ isExpanded(request.id) ? '▾' : '▸' }}</span>
                  </button>
                </td>
                <td class="date">{{ formatDate(request.requestedAt) }}</td>
                <td>
                  <span class="status" :class="'status--' + request.status">
                    <span aria-hidden="true">{{ statusIcons[request.status] }}</span>
                    {{ t('requests.status.' + request.status) }}
                  </span>
                </td>
                <td>
                  <RouterLink
                    :to="{ name: 'distributor', params: { id: request.distributorId } }"
                    >{{ distributorName(request.distributorId) }}</RouterLink
                  >
                  <span
                    v-if="noticeFor(request.distributorId)"
                    class="notice-marker"
                    role="img"
                    :aria-label="t('requests.noticeMarker')"
                    :title="noticeFor(request.distributorId)?.text"
                    >⚠</span
                  >
                </td>
                <td>{{ t('requests.formats.' + request.format) }}</td>
                <td>{{ request.language }}</td>
                <td>{{ request.cinema }}</td>
              </tr>
              <tr v-show="isExpanded(request.id)" :id="detailsId(request.id)" class="details-row">
                <td colspan="7">
                  <RequestDetails :request="request" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>

<style scoped>
section {
  margin-top: var(--space-6);
}

h2 {
  margin: 0 0 var(--space-3);
  font-size: 1.125rem;
}

.empty {
  color: var(--color-text-muted);
}

.subtle {
  color: var(--color-text-muted);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.filters label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
}

.filters input {
  width: 12rem;
}

.reset {
  color: var(--color-text-muted);
  background: transparent;
  border-color: var(--color-border);
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: var(--space-2) var(--space-3);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

th {
  font-weight: 600;
  color: var(--color-text-muted);
}

.sort {
  padding: 0;
  font-weight: 600;
  color: var(--color-text-muted);
  background: transparent;
  border: 0;
}

.sort:hover {
  color: var(--color-text);
}

tbody tr:hover {
  background: var(--color-surface);
}

.date {
  font-variant-numeric: tabular-nums;
}

.toggle-cell {
  width: 1%;
  padding-right: 0;
}

.toggle {
  padding: 0 var(--space-2);
  color: var(--color-text-muted);
  background: transparent;
  border-color: transparent;
}

.toggle:hover {
  color: var(--color-text);
  border-color: var(--color-border);
}

.details-row {
  background: var(--color-surface);
}

.details-row td {
  padding-left: var(--space-6);
  white-space: normal;
}

.cards {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.card p {
  margin: var(--space-1) 0 0;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.card-distributor {
  font-weight: 600;
}

.card-toggle {
  margin-top: var(--space-2);
  padding: var(--space-2) 0;
  color: var(--color-text-muted);
  background: transparent;
  border: 0;
}

.card-details {
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border);
}

.status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 0 var(--space-2);
  font-size: 0.8125rem;
  border: 1px solid currentColor;
  border-radius: var(--radius);
}

.status--open {
  color: var(--color-status-open);
}

.status--granted {
  color: var(--color-status-granted);
}

.status--declined {
  color: var(--color-status-declined);
}

.notice-marker {
  color: var(--color-warning);
  cursor: help;
}
</style>

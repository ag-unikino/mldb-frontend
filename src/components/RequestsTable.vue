<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getActiveNote, getDistributorById } from '../api/distributors'
import type { FilmRequest, RequestStatus } from '../api/requests'

defineProps<{ requests: FilmRequest[] }>()

const { t, locale } = useI18n()

const statusIcons: Record<RequestStatus, string> = {
  open: '●',
  granted: '✓',
  declined: '✗',
}

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

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(iso),
  )
}

function distributorName(id: number): string {
  return getDistributorById(id)?.name ?? '–'
}

function noticeFor(distributorId: number) {
  return getActiveNote(getDistributorById(distributorId))
}
</script>

<template>
  <section>
    <h2>{{ t('requests.title') }}</h2>
    <p v-if="requests.length === 0" class="empty">{{ t('requests.empty') }}</p>
    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">
              <span class="visually-hidden">{{ t('requests.columns.details') }}</span>
            </th>
            <th scope="col">{{ t('requests.columns.date') }}</th>
            <th scope="col">{{ t('requests.columns.status') }}</th>
            <th scope="col">{{ t('requests.columns.distributor') }}</th>
            <th scope="col">{{ t('requests.columns.format') }}</th>
            <th scope="col">{{ t('requests.columns.language') }}</th>
            <th scope="col">{{ t('requests.columns.cinema') }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="request in requests" :key="request.id">
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
                {{ distributorName(request.distributorId) }}
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
                <dl class="details">
                  <template v-if="request.answeredAt">
                    <dt>{{ t('requests.details.answeredAt') }}</dt>
                    <dd>{{ formatDate(request.answeredAt) }}</dd>
                  </template>
                  <dt>{{ t('requests.details.contact') }}</dt>
                  <dd v-if="request.contact">
                    {{ request.contact.name }} ·
                    <a :href="'mailto:' + request.contact.email">{{ request.contact.email }}</a>
                  </dd>
                  <dd v-else class="subtle">{{ t('requests.details.noContact') }}</dd>
                  <template v-if="request.adRights">
                    <dt>{{ t('requests.details.adRights') }}</dt>
                    <dd>{{ request.adRights }}</dd>
                  </template>
                  <template v-if="request.comment">
                    <dt>{{ t('requests.details.comment') }}</dt>
                    <dd>{{ request.comment }}</dd>
                  </template>
                  <template v-if="request.declineReason">
                    <dt>{{ t('requests.details.declineReason') }}</dt>
                    <dd>{{ request.declineReason }}</dd>
                  </template>
                  <template v-if="request.referredToDistributorId !== undefined">
                    <dt>{{ t('requests.details.referredTo') }}</dt>
                    <dd>{{ distributorName(request.referredToDistributorId) }}</dd>
                  </template>
                </dl>
                <template v-if="noticeFor(request.distributorId)">
                  <dt>{{ t('requests.details.distributorNotice') }}</dt>
                  <dd>{{ noticeFor(request.distributorId)?.text }}</dd>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
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

.details {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--space-1) var(--space-6);
  margin: 0;
}

.details dt {
  color: var(--color-text-muted);
}

.details dd {
  margin: 0;
}

.subtle {
  color: var(--color-text-muted);
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

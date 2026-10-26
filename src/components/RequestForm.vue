<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { getActiveNote, getAllDistributors, getDistributorById } from '../api/distributors'
import { getAllFilms, getFilmById } from '../api/films'
import {
  createRequest,
  updateRequest,
  type FilmRequest,
  type NewRequest,
  type RequestStatus,
} from '../api/requests'
import { FORMATS, LANGUAGE_SUGGESTIONS, type FilmFormat } from '../constants/requestOptions'
import { useAuthStore } from '../stores/auth'
import DistributorNotice from './DistributorNotice.vue'
import FormField from './FormField.vue'

type FieldName =
  | 'filmId'
  | 'distributorId'
  | 'cinema'
  | 'requestedAt'
  | 'answeredAt'
  | 'language'
  | 'contactName'
  | 'contactEmail'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const props = defineProps<{ request?: FilmRequest; initialFilmId?: number }>()

const { t, locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const isEdit = computed(() => props.request !== undefined)

const statuses: RequestStatus[] = ['open', 'granted', 'declined']

const cinemas = computed(() => auth.account?.cinemas ?? [])

function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

const form = reactive({
  filmId: (props.request?.filmId ?? props.initialFilmId ?? '') as number | '',
  distributorId: (props.request?.distributorId ?? '') as number | '',
  cinema: props.request?.cinema ?? (cinemas.value.length === 1 ? (cinemas.value[0] ?? '') : ''),
  status: (props.request?.status ?? 'open') as RequestStatus,
  requestedAt: props.request?.requestedAt ?? todayIso(),
  answeredAt: props.request?.answeredAt ?? '',
  format: (props.request?.format ?? 'dcp') as FilmFormat,
  language: props.request?.language ?? '',
  contactName: props.request?.contact?.name ?? '',
  contactEmail: props.request?.contact?.email ?? '',
  adRights: props.request?.adRights ?? '',
  comment: props.request?.comment ?? '',
  declineReason: props.request?.declineReason ?? '',
  referredToDistributorId: (props.request?.referredToDistributorId ?? '') as number | '',
})

const initialSnapshot = JSON.stringify(form)
const isDirty = computed(() => JSON.stringify(form) !== initialSnapshot)

const films = computed(() =>
  getAllFilms().sort((a, b) => a.originalTitle.localeCompare(b.originalTitle, locale.value)),
)
const distributors = computed(() =>
  getAllDistributors().sort((a, b) => a.name.localeCompare(b.name, locale.value)),
)
const selectedFilm = computed(() => (form.filmId === '' ? undefined : getFilmById(form.filmId)))
const distributorNotice = computed(() =>
  form.distributorId === '' ? undefined : getActiveNote(getDistributorById(form.distributorId)),
)

const needsEmailConfirmation = computed(
  () => form.contactName.trim() !== '' && form.contactEmail.trim() === '',
)

const errors = computed(() => {
  const result: Partial<Record<FieldName, string>> = {}
  const required = t('requestForm.errors.required')

  if (form.filmId === '') result.filmId = required
  if (form.distributorId === '') result.distributorId = required
  if (form.cinema === '') result.cinema = required
  if (form.requestedAt === '') result.requestedAt = required
  if (form.language.trim() === '') result.language = required

  if (
    form.status !== 'open' &&
    form.answeredAt !== '' &&
    form.requestedAt !== '' &&
    form.answeredAt < form.requestedAt
  ) {
    result.answeredAt = t('requestForm.errors.answerBeforeRequest')
  }

  const hasName = form.contactName.trim() !== ''
  const hasEmail = form.contactEmail.trim() !== ''
  if (hasEmail && !hasName) result.contactName = required
  if (hasEmail && !EMAIL_PATTERN.test(form.contactEmail.trim())) {
    result.contactEmail = t('requestForm.errors.email')
  }

  return result
})

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

const showErrors = ref(false)
const saving = ref(false)
const saveFailed = ref(false)
const saved = ref(false)
const showEmailWarning = ref(false)
const emailConfirmed = ref(false)
const formEl = ref<HTMLFormElement | null>(null)

watch(needsEmailConfirmation, (needs) => {
  if (!needs) {
    showEmailWarning.value = false
    emailConfirmed.value = false
  }
})

function errorFor(name: FieldName): string | undefined {
  return showErrors.value ? errors.value[name] : undefined
}

const cancelTarget = computed(() =>
  form.filmId === '' ? { name: 'home' } : { name: 'film', params: { id: form.filmId } },
)

async function submit() {
  showErrors.value = true
  const { filmId, distributorId } = form

  if (hasErrors.value || filmId === '' || distributorId === '') {
    await nextTick()
    formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }

  if (needsEmailConfirmation.value && !emailConfirmed.value) {
    showEmailWarning.value = true
    return
  }

  const payload: NewRequest = {
    filmId,
    distributorId,
    status: form.status,
    requestedAt: form.requestedAt,
    format: form.format,
    language: form.language.trim(),
    cinema: form.cinema,
  }

  if (form.status !== 'open' && form.answeredAt !== '') payload.answeredAt = form.answeredAt

  const contactName = form.contactName.trim()
  const contactEmail = form.contactEmail.trim()
  if (contactName) {
    payload.contact = contactEmail
      ? { name: contactName, email: contactEmail }
      : { name: contactName }
  }

  if (form.adRights.trim()) payload.adRights = form.adRights.trim()
  if (form.comment.trim()) payload.comment = form.comment.trim()
  if (form.status === 'declined') {
    if (form.declineReason.trim()) payload.declineReason = form.declineReason.trim()
    if (form.referredToDistributorId !== '') {
      payload.referredToDistributorId = form.referredToDistributorId
    }
  }

  saving.value = true
  saveFailed.value = false
  try {
    const result = props.request
      ? await updateRequest(props.request.id, payload)
      : await createRequest(payload)
    if (!result) throw new Error('Request not found')
    saved.value = true
    await router.push({ name: 'film', params: { id: filmId } })
  } catch {
    saveFailed.value = true
  } finally {
    saving.value = false
  }
}

async function confirmWithoutEmail() {
  emailConfirmed.value = true
  showEmailWarning.value = false
  await submit()
}

function addEmail() {
  showEmailWarning.value = false
  formEl.value?.querySelector<HTMLElement>('#contactEmail')?.focus()
}

onBeforeRouteLeave(() => {
  if (saved.value || !isDirty.value) return true
  return window.confirm(t('requestForm.leaveConfirm'))
})
</script>

<template>
  <form ref="formEl" class="form" novalidate @submit.prevent="submit">
    <p class="subtle">{{ t('requestForm.requiredNote') }}</p>

    <div v-if="isEdit" class="field">
      <span class="label">{{ t('requestForm.film') }}</span>
      <p class="static">{{ selectedFilm?.originalTitle }} ({{ selectedFilm?.year }})</p>
    </div>
    <FormField
      v-else
      id="filmId"
      :label="t('requestForm.film')"
      :error="errorFor('filmId')"
      required
      v-slot="{ id, invalid, describedby }"
    >
      <select
        :id="id"
        v-model.number="form.filmId"
        aria-required="true"
        :aria-invalid="invalid"
        :aria-describedby="describedby"
      >
        <option value="">{{ t('requestForm.choose') }}</option>
        <option v-for="film in films" :key="film.id" :value="film.id">
          {{ film.originalTitle }} ({{ film.year }})
        </option>
      </select>
    </FormField>

    <FormField
      id="distributorId"
      :label="t('requests.columns.distributor')"
      :error="errorFor('distributorId')"
      required
      v-slot="{ id, invalid, describedby }"
    >
      <select
        :id="id"
        v-model.number="form.distributorId"
        aria-required="true"
        :aria-invalid="invalid"
        :aria-describedby="describedby"
      >
        <option value="">{{ t('requestForm.choose') }}</option>
        <option v-for="distributor in distributors" :key="distributor.id" :value="distributor.id">
          {{ distributor.name }}
        </option>
      </select>
    </FormField>
    <DistributorNotice v-if="distributorNotice" :note="distributorNotice" />

    <div v-if="isEdit" class="field">
      <span class="label">{{ t('requests.columns.cinema') }}</span>
      <p class="static">{{ form.cinema }}</p>
    </div>
    <FormField
      v-else
      id="cinema"
      :label="t('requests.columns.cinema')"
      :error="errorFor('cinema')"
      required
      v-slot="{ id, invalid, describedby }"
    >
      <select
        :id="id"
        v-model="form.cinema"
        aria-required="true"
        :aria-invalid="invalid"
        :aria-describedby="describedby"
      >
        <option value="">{{ t('requestForm.choose') }}</option>
        <option v-for="cinema in cinemas" :key="cinema" :value="cinema">{{ cinema }}</option>
      </select>
    </FormField>

    <fieldset class="choices">
      <legend>{{ t('requests.columns.status') }}</legend>
      <label v-for="status in statuses" :key="status" class="radio">
        <input v-model="form.status" type="radio" name="status" :value="status" />
        {{ t('requests.status.' + status) }}
      </label>
    </fieldset>

    <FormField
      id="requestedAt"
      :label="t('requestForm.requestedAt')"
      :error="errorFor('requestedAt')"
      required
      v-slot="{ id, invalid, describedby }"
    >
      <input
        :id="id"
        v-model="form.requestedAt"
        type="date"
        aria-required="true"
        :aria-invalid="invalid"
        :aria-describedby="describedby"
      />
    </FormField>

    <FormField
      v-if="form.status !== 'open'"
      id="answeredAt"
      :label="t('requests.details.answeredAt')"
      :error="errorFor('answeredAt')"
      v-slot="{ id, invalid, describedby }"
    >
      <input
        :id="id"
        v-model="form.answeredAt"
        type="date"
        :aria-invalid="invalid"
        :aria-describedby="describedby"
      />
    </FormField>

    <FormField
      id="format"
      :label="t('requests.columns.format')"
      required
      v-slot="{ id, describedby }"
    >
      <select :id="id" v-model="form.format" aria-required="true" :aria-describedby="describedby">
        <option v-for="entry in FORMATS" :key="entry.value" :value="entry.value">
          {{ entry.label }}
        </option>
      </select>
    </FormField>

    <FormField
      id="language"
      :label="t('requests.columns.language')"
      :hint="t('requestForm.languageHint')"
      :error="errorFor('language')"
      required
      v-slot="{ id, invalid, describedby }"
    >
      <input
        :id="id"
        v-model="form.language"
        type="text"
        list="language-suggestions"
        autocomplete="off"
        aria-required="true"
        :aria-invalid="invalid"
        :aria-describedby="describedby"
      />
      <datalist id="language-suggestions">
        <option v-for="suggestion in LANGUAGE_SUGGESTIONS" :key="suggestion" :value="suggestion" />
      </datalist>
    </FormField>

    <fieldset class="group">
      <legend>{{ t('requestForm.contactLegend') }}</legend>
      <FormField
        id="contactName"
        :label="t('requestForm.contactName')"
        :error="errorFor('contactName')"
        v-slot="{ id, invalid, describedby }"
      >
        <input
          :id="id"
          v-model="form.contactName"
          type="text"
          autocomplete="off"
          :aria-invalid="invalid"
          :aria-describedby="describedby"
        />
      </FormField>
      <FormField
        id="contactEmail"
        :label="t('requestForm.contactEmail')"
        :error="errorFor('contactEmail')"
        v-slot="{ id, invalid, describedby }"
      >
        <input
          :id="id"
          v-model="form.contactEmail"
          type="email"
          autocomplete="off"
          :aria-invalid="invalid"
          :aria-describedby="describedby"
        />
      </FormField>
    </fieldset>

    <FormField id="adRights" :label="t('requests.details.adRights')" v-slot="{ id }">
      <input :id="id" v-model="form.adRights" type="text" />
    </FormField>

    <FormField id="comment" :label="t('requests.details.comment')" v-slot="{ id }">
      <textarea :id="id" v-model="form.comment" rows="3"></textarea>
    </FormField>

    <template v-if="form.status === 'declined'">
      <FormField id="declineReason" :label="t('requests.details.declineReason')" v-slot="{ id }">
        <input :id="id" v-model="form.declineReason" type="text" />
      </FormField>
      <FormField id="referredTo" :label="t('requests.details.referredTo')" v-slot="{ id }">
        <select :id="id" v-model.number="form.referredToDistributorId">
          <option value="">{{ t('requestForm.none') }}</option>
          <option v-for="distributor in distributors" :key="distributor.id" :value="distributor.id">
            {{ distributor.name }}
          </option>
        </select>
      </FormField>
    </template>

    <p v-if="saveFailed" class="error" role="alert">{{ t('requestForm.saveFailed') }}</p>

    <div v-if="showEmailWarning" class="warning" role="alert">
      <p>{{ t('requestForm.noEmailWarning') }}</p>
      <div class="warning-actions">
        <button type="button" @click="confirmWithoutEmail">
          {{ t('requestForm.saveWithoutEmail') }}
        </button>
        <button type="button" class="secondary" @click="addEmail">
          {{ t('requestForm.addEmail') }}
        </button>
      </div>
    </div>

    <div class="actions">
      <button type="submit" :disabled="saving">
        {{ saving ? t('requestForm.saving') : t('requestForm.save') }}
      </button>
      <RouterLink :to="cancelTarget">{{ t('requestForm.cancel') }}</RouterLink>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: var(--space-4);
  max-width: 36rem;
}

.subtle {
  margin: 0;
  color: var(--color-text-muted);
}

.label {
  display: block;
  margin-bottom: var(--space-1);
}

.static {
  margin: 0;
}

select,
textarea,
input[type='text'],
input[type='email'],
input[type='date'] {
  width: 100%;
}

[aria-invalid='true'] {
  border-color: var(--color-status-declined);
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  margin: 0;
  padding: 0;
  border: 0;
}

.choices legend {
  width: 100%;
  padding: 0;
  margin-bottom: var(--space-1);
}

.radio {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

input[type='radio'] {
  width: auto;
  padding: 0;
  accent-color: var(--color-primary);
}

.group {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.error {
  margin: 0;
  color: var(--color-status-declined);
}

.warning {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius);
}

.warning p {
  margin: 0 0 var(--space-3);
}

.warning-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-3);
}

.secondary {
  color: var(--color-text);
  background: transparent;
  border-color: var(--color-border);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
</style>

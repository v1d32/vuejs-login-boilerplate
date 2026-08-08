<template>
  <div class="q-pa-md max-width-container">
    <h4 class="q-my-md">User Profile</h4>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-dots color="primary" size="50px" />
      <p class="text-faded q-mt-sm">Memuat profil...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="q-pa-sm">
      <div class="bg-negative text-white q-pa-md rounded-borders">
        <strong>Gagal memuat data:</strong> {{ error }}
      </div>
    </div>

    <!-- Profile Card (Quasar Style) -->
    <q-card v-else-if="user" class="q-ma-xs">
      <!-- Header / Basic Info -->
      <q-card-title class="bg-primary text-white">
        <div class="row items-center no-wrap">
          <!-- Avatar Bulat -->
          <div class="avatar-circle q-mr-md text-bold text-primary">
            {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
          </div>

          <!-- Text Info Header -->
          <div class="col">
            <div class="text-h6 text-bold leading-normal">{{ user.name }}</div>
            <div class="text-subtitle2 text-light" style="opacity: 0.85;">{{ user.email }}</div>
          </div>
        </div>
      </q-card-title>

      <q-card-separator />

      <!-- Detail Info -->
      <q-card-main>
        <div class="row multiline-grid">
          <div class="col-12 col-md-6 q-pa-sm">
            <div class="text-bold text-faded uppercase-label">User ID</div>
            <div class="code-box">{{ user.id }}</div>
          </div>

          <div class="col-12 col-md-6 q-pa-sm">
            <div class="text-bold text-faded uppercase-label">Status Verifikasi Email</div>
            <q-chip
              :color="user.email_verified_at ? 'positive' : 'warning'"
              text-color="white"
              dense
            >
              {{ user.email_verified_at ? `Terverifikasi (${formatDate(user.email_verified_at)})` : 'Belum Verifikasi' }}
            </q-chip>
          </div>

          <div class="col-12 col-md-6 q-pa-sm">
            <div class="text-bold text-faded uppercase-label">Terakhir Login</div>
            <div>{{ formatDate(user.last_logged_in) }}</div>
          </div>

          <div class="col-12 col-md-6 q-pa-sm">
            <div class="text-bold text-faded uppercase-label">Tanggal Dibuat</div>
            <div>{{ formatDate(user.created_at) }}</div>
          </div>
        </div>

        <q-card-separator class="q-my-md" />

        <!-- Roles Section -->
        <div>
          <div class="text-subtitle1 text-bold q-mb-sm">Roles & Permissions</div>
          <div class="row gap-xs">
            <q-chip
              v-for="role in user.roles"
              :key="role.id"
              color="indigo"
              text-color="white"
              icon="security"
            >
              {{ role.name }} ({{ role.guard_name }})
            </q-chip>
          </div>
        </div>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import {
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QChip,
  QSpinnerDots
} from 'quasar'

export default {
  name: 'UserProfile',
  components: {
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QChip,
    QSpinnerDots
  },
  data() {
    return {
      user: null,
      loading: true,
      error: null
    }
  },
  mounted() {
    this.fetchUserProfile()
  },
  methods: {
    async fetchUserProfile() {
      this.loading = true
      this.error = null

      const token = localStorage.getItem('bearerauth') || 'YOUR_BEARER_TOKEN_HERE'

      try {
        const response = await fetch(`${process.env.API_BASE}/user-profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }

        const result = await response.json()
        if (result.success) {
          this.user = result.data
        } else {
          this.error = result.message || 'Gagal mengambil data profile.'
        }
      } catch (err) {
        this.error = err.message || 'Terjadi kesalahan jaringan.'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date)
    }
  }
}
</script>

<style scoped>
.max-width-container {
  max-width: 800px;
  margin: 0 auto;
}
.uppercase-label {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}
.code-box {
  background: #f5f5f5;
  padding: 6px 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  word-break: break-all;
}
.leading-normal {
  line-height: 1.2;
}

/* Bulatan Avatar Pengganti QAvatar untuk Quasar v0.14 */
.avatar-circle {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}
</style>

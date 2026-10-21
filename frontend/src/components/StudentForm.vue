<script setup>
import { reactive, ref } from 'vue';

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-student']);

const form = reactive({
  name: '',
  studentId: '',
  phone: '',
  zip: ''
});

const validationError = ref('');

async function handleSubmit() {
  validationError.value = '';
  const name = form.name.trim();
  const studentId = String(form.studentId).trim();
  const phone = form.phone.trim();
  const zip = form.zip.trim();

  if (!name || !studentId || !phone || !zip) {
    validationError.value = 'All fields (Name, Student ID, Phone, and ZIP Code) are required.';
    return;
  }

  emit('submit-student', { name, studentId, phone, zip }, () => {
    form.name = '';
    form.studentId = '';
    form.phone = '';
    form.zip = '';
  });
}
</script>

<template>
  <section class="card">
    <h2 class="card-title">Add a Student</h2>
    <p v-if="validationError" class="inline-error" role="alert">{{ validationError }}</p>

    <form class="form-grid" @submit.prevent="handleSubmit" novalidate>
      <div class="form-group">
        <label for="addName">Student Name *</label>
        <input
          id="addName"
          v-model="form.name"
          type="text"
          placeholder="e.g., John"
          required
        />
      </div>

      <div class="form-group">
        <label for="addId">Student ID *</label>
        <input
          id="addId"
          v-model="form.studentId"
          type="text"
          placeholder="e.g., 1001"
          required
        />
      </div>

      <div class="form-group">
        <label for="addPhone">Phone Number *</label>
        <input
          id="addPhone"
          v-model="form.phone"
          type="text"
          placeholder="e.g., 555-1234"
          required
        />
      </div>

      <div class="form-group">
        <label for="addZip">ZIP Code *</label>
        <input
          id="addZip"
          v-model="form.zip"
          type="text"
          placeholder="e.g., 77001"
          required
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : 'Add Student' }}
        </button>
      </div>
    </form>
  </section>
</template>
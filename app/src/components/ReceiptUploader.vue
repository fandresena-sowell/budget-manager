<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="receipt-uploader q-pa-md">
    <div
      v-if="!imagePreview && !uploading"
      class="upload-zone"
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <q-icon name="upload" size="48px" color="primary" />
      <div class="text-subtitle1 q-mt-sm">
        Drop receipt image here or click to upload
      </div>
      <div class="text-caption text-grey">
        Supported formats: JPG, PNG, GIF (max 5MB)
      </div>
    </div>

    <div v-if="imagePreview" class="preview-container">
      <q-img
        :src="imagePreview"
        spinner-color="primary"
        style="max-width: 300px"
      />
      <div class="actions q-mt-sm">
        <q-btn
          flat
          color="negative"
          icon="delete"
          label="Remove"
          @click="clearImage"
        />
        <q-btn
          color="primary"
          icon="cloud_upload"
          label="Upload"
          :loading="uploading"
          @click="uploadImage"
        />
      </div>
    </div>

    <q-linear-progress
      v-if="uploading"
      :value="uploadProgress"
      color="primary"
      class="q-mt-md"
    />

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import StorageService from 'src/services/storage';

const props = defineProps<{
  expenseId: string;
}>();

const emit = defineEmits<{
  (e: 'upload-complete', url: string): void;
  (e: 'upload-error', error: Error): void;
}>();

const $q = useQuasar();
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const uploading = ref(false);
const uploadProgress = ref(0);

const isValidFile = computed(() => {
  if (!selectedFile.value) return false;
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return (
    validTypes.includes(selectedFile.value.type) &&
    selectedFile.value.size <= maxSize
  );
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length && input.files[0] instanceof File) {
    processSelectedFile(input.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  if (file && file instanceof File) {
    processSelectedFile(file);
  }
};

const processSelectedFile = (file: File) => {
  selectedFile.value = file;
  if (!isValidFile.value) {
    $q.notify({
      type: 'negative',
      message: 'Invalid file. Please select an image under 5MB.',
    });
    clearImage();
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const clearImage = () => {
  selectedFile.value = null;
  imagePreview.value = null;
  uploadProgress.value = 0;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const uploadImage = async () => {
  if (!selectedFile.value || !isValidFile.value) return;

  try {
    uploading.value = true;
    const { downloadUrl } = await StorageService.uploadReceipt(
      selectedFile.value,
      props.expenseId,
      (progress) => {
        uploadProgress.value = progress;
      }
    );

    emit('upload-complete', downloadUrl);
    $q.notify({
      type: 'positive',
      message: 'Receipt uploaded successfully',
    });
    clearImage();
  } catch (error) {
    emit('upload-error', error as Error);
    $q.notify({
      type: 'negative',
      message: 'Failed to upload receipt',
    });
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.receipt-uploader {
  width: 100%;
}

.upload-zone {
  border: 2px dashed var(--q-primary);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-zone:hover {
  background: rgba(var(--q-primary), 0.1);
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.actions {
  display: flex;
  gap: 1rem;
}
</style>

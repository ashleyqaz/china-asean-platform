<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <img :src="imageUrl" alt="微信公众号二维码" class="modal-image">
        <p class="modal-hint">点击遮罩关闭</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  visible: Boolean,
  imageUrl: String
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: var(--color-bg);
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-image {
  max-width: 300px;
  max-height: 300px;
  width: 100%;
  height: auto;
}

.modal-hint {
  margin-top: 16px;
  font-size: 13px;
  color: var(--color-text-muted);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

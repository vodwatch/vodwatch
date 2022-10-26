<template>
  <svg class="svg-color" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z" fill="#000"/><path d="M11 9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 10a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="#000"/><path d="M16 9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 10a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM7.427 13.18a1 1 0 0 1 1.392.247c.49.698 1.393 1.495 2.472 1.719.984.204 2.35-.02 3.966-1.815a1 1 0 0 1 1.486 1.338c-1.984 2.205-4.034 2.814-5.859 2.435-1.73-.36-3.026-1.563-3.703-2.53a1 1 0 0 1 .246-1.393z" fill="#000"/></svg>
</template>

<script>
export default {
  name: "EmoteIcon"
}
</script>

<style scoped>
  .svg-color {
    filter: invert(99%) sepia(7%) saturate(11%) hue-rotate(306deg) brightness(120%) contrast(100%);
  }
  .svg-color:hover {
    filter: invert(100%) sepia(2%) saturate(2105%) hue-rotate(301deg) brightness(90%) contrast(77%);
  }
</style>

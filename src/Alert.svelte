<script>
    export let text = '';
    export let type = '';
  </script>
  
  <div
    class="alert"
    class:success={type === 'success'}
    class:failure={type === 'failure'}
  >
    { text }
  </div>
  
  <style>
    .alert {
      @apply px-4 py-2 rounded font-bold;
    }
  
    .success {
      @apply bg-green-500;
    }
  
    .failure {
      @apply bg-red-500;
    }
  </style>
  
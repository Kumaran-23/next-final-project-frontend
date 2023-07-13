<script>
  export let text = '';
  export let type = '';
</script>

<div class="flex items-center p-4 mb-4 text-sm rounded-lg" class:success={type === 'success'} class:failure={type === 'failure'}>
  <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill={type === 'success' ? '#03543F' : '#9B1C1C'} viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <div>
    <span class:success-text={type === 'success'} class:failure-text={type === 'failure'}>{text}</span>
  </div>
</div>

<style>
  .success {
    background-color: #F3FAF7;
  }

  .failure {
    background-color: #FDF2F2;
  }

  .success.dark {
    background-color: #1F2937;
  }

  .failure.dark {
    background-color: #1F2937;
  }

  .success-text {
    color: #03543F;
  }

  .failure-text {
    color: #9B1C1C;
  }

  .success-text.dark {
    color: #31C48D;
  }

  .failure-text.dark {
    color: #F98080;
  }
</style>
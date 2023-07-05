<script>
  export let text = '';
  export let type = '';
</script>

<div class="alertContainer" class:success={type === 'success'} class:failure={type === 'failure'}>
  <div class="alertText">
    {text}
  </div>
</div>

<style>
  .alertContainer {
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    padding: 10px;
    font-weight: bold;
    border-radius: 4px;
  }

  .success {
    background-color: #52c41a;
  }

  .failure {
    background-color: #f5222d;
  }
</style>

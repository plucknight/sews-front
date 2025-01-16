<template>
  <div id="title">
    <slot name="title"></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
#title {
  width: 100%;
  height: 30px;
  padding-left: 1rem;
}
@media screen and (max-width: 720px) {
  #title {
    width: 50%;
    margin-left: 3rem;
  }
}
</style>

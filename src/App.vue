<template>
  <div>
    <Progress :percent="25" />
    <Progress :percent="45" status="active" />
    <Progress :percent="65" status="wrong" />
    <Progress :percent="100" />
    <Progress :percent="25" hide-info />
  </div>
</template>
<script>
export default {
        
};
</script>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="top-nav">
    <RouterLink to="/students">Students</RouterLink>
    <span> | </span>
    <RouterLink to="/courses">Courses</RouterLink>
    <span> | </span>
    <RouterLink to="/enrollments">Enrollments</RouterLink>
  </nav>
</template>
<script setup>
import { onMounted } from 'vue';
import { useStudentStore } from '../stores/studentStore';
import { useCourseStore } from '../stores/courseStore';
import { useEnrollmentStore } from '../stores/enrollmentStore';
import StatusAlert from '../components/StatusAlert.vue';
import EnrollmentForm from '../components/EnrollmentForm.vue';
import CourseRoster from '../components/CourseRoster.vue';

const studentStore = useStudentStore();
const courseStore = useCourseStore();
const enrollmentStore = useEnrollmentStore();

onMounted(async () => {
  enrollmentStore.clearFeedback();
  await Promise.all([
    studentStore.fetchStudents(),
    courseStore.fetchCourses()
  ]);
  if (enrollmentStore.selectedCourseId) {
    await enrollmentStore.fetchCourseRoster(enrollmentStore.selectedCourseId);
  }
});

async function handleEnrollStudent(studentId, courseId, resetForm) {
  const ok = await enrollmentStore.enrollStudent(studentId, courseId);
  if (ok) {
    resetForm();
  }
}

async function handleSelectCourse(courseId) {
  await enrollmentStore.fetchCourseRoster(courseId);
}
</script>

<template>
  <div>
    <StatusAlert
      :error="enrollmentStore.error"
      :success="enrollmentStore.successMessage"
      @dismiss="enrollmentStore.clearFeedback"
    />

    <EnrollmentForm
      :students="studentStore.students"
      :courses="courseStore.courses"
      :loading="enrollmentStore.loading"
      @enroll-student="handleEnrollStudent"
    />

    <CourseRoster
      :courses="courseStore.courses"
      :selected-course-id="enrollmentStore.selectedCourseId"
      :roster-students="enrollmentStore.rosterStudents"
      :loading="enrollmentStore.loading"
      @select-course="handleSelectCourse"
    />
  </div>
</template>
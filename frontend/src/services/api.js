const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  getStudents(query = '') {
    const q = query ? `?q=${encodeURIComponent(query)}` : '';
    return request(`/api/students${q}`);
  },
  addStudent(student) {
    return request('/api/students', {
      method: 'POST',
      body: JSON.stringify(student)
    });
  },
  deleteStudent(id) {
    return request(`/api/students/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  getCourses() {
    return request('/api/courses');
  },
  addCourse(course) {
    return request('/api/courses', {
      method: 'POST',
      body: JSON.stringify(course)
    });
  },
  deleteCourse(id) {
    return request(`/api/courses/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  getEnrollments(courseId = '') {
    const q = courseId ? `?courseId=${encodeURIComponent(courseId)}` : '';
    return request(`/api/enrollments${q}`);
  },
  enrollStudent(payload) {
    return request('/api/enrollments', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  getCourseStudents(courseId) {
    return request(`/api/courses/${encodeURIComponent(courseId)}/students`);
  }
};
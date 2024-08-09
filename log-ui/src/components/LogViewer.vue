<template>
  <div>
    <h1>Log Viewer</h1>
    <select v-model="selectedFile" @change="fetchLogs">
      <option v-for="file in files" :key="file" :value="file">{{ file }}</option>
    </select>
    <input type="text" v-model="keyword" placeholder="Keyword" @input="fetchLogs">
    <ul>
      <li v-for="line in logs" :key="line">{{ line }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      files: [],
      selectedFile: '',
      keyword: '',
      logs: []
    };
  },
  methods: {
    fetchFiles() {
      axios.get('http://localhost:3000/logs')
        .then(response => {
          this.files = response.data;
        });
    },
    fetchLogs() {
      if (!this.selectedFile) return;

      axios.get(`http://localhost:3000/logs/${this.selectedFile}`, {
        params: {
          keyword: this.keyword,
          limit: 100
        }
      }).then(response => {
        this.logs = response.data;
      });
    }
  },
  mounted() {
    this.fetchFiles();
  }
};
</script>

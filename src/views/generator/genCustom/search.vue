<template>
  <div class="app-container">
    <!--查询框-->
    <div v-for="(condition,idx) in conditionList" :key="idx" class="search-field">
      <el-input v-model="searchForm[condition.columnName]" :placeholder="'输入'+condition.remark+'搜索'" clearable size="small" style="width: 200px;" @keyup.enter.native="doSearch" />
    </div>
    <span>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="doSearch">搜索</el-button>
      <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="resetForm">重置</el-button>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      conditionList: [],
      searchForm: {}
    }
  },
  watch: {
    columns: function(columnList) {
      this.conditionList = []
      columnList.forEach((val) => {
        if (val.queryType) {
          this.conditionList.push(val)
        }
      })
    }
  },
  created() {
    this.$nextTick(() => {
      this.conditionList = []
      this.columns.forEach((val) => {
        if (val.queryType) {
          this.conditionList.push(val)
        }
      })
    })
  },
  methods: {
    doSearch() {
      console.log('searchForm', this.searchForm)
    },
    resetForm() {
    }
  }
}
</script>

<style scoped>
  .search-field {
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
  }
</style>

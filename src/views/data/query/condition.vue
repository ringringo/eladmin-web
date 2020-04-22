<template>
  <div class="app-container">
    <!--查询框-->
    <div v-for="(condition,idx) in conditionList" :key="idx" class="search-field">
      <el-select v-model="condition.code" clearable placeholder="列" style="width: 100px;">
        <el-option v-for="item in columns" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-select v-model="condition.opt" clearable placeholder="请选择活动区域" style="width: 70px;">
        <el-option label="like" value="like" />
        <el-option label="=" value="=" />
        <el-option label=">" value=">" />
        <el-option label=">=" value=">=" />
        <el-option label="<" value="<" />
        <el-option label="<=" value="<=" />
        <el-option label="<>" value="<>" />
      </el-select>
      <el-input v-model="condition.value" placeholder="值" style="width: 100px;" />
    </div>
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
      columnMap: {},
      conditionList: []
    }
  },
  watch: {
    columns: function(columnList) {
      columnList.forEach((val) => {
        this.columnMap[val['code']] = val
      })
    }
  },
  created() {
    this.$nextTick(() => {
      for (let i = 0; i < 6; i++) {
        this.conditionList.push({ code: null, opt: '=', value: null })
      }
    })
  },
  methods: {
    getCnd() {
      const cndList = []
      // 这里组织查询条件
      this.conditionList.forEach((condition) => {
        if (condition.code) {
          cndList.push({
            dataColumn: this.columnMap[condition.code],
            opt: condition.opt,
            value: condition.value
          })
        }
      })
      return cndList
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

<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery" />
    <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 80px">
      <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
    </el-select>
    <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <!--表格渲染-->
    <el-table ref="table" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="名称" />
      <el-table-column prop="name" label="描述" />
      <el-table-column prop="type" label="类型" />
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudGenModuleConfig from '@/api/generator/genModuleConfig'
import Sortable from 'sortablejs'
export default {
  mixins: [crud],
  data() {
    return {
      title: 'genModuleConfig',
      crudMethod: { ...crudGenModuleConfig },
      form: { id: null, name: null, type: null, content: null },
      rules: {
        id: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '描述' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted() {
    this.rowDrop()
    this.columnDrop()
  },
  methods: {
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/genModuleConfig'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    rowDrop() {
      const tableBody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tableBody, {
        group: 'selectModuleGroup',
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.data.splice(oldIndex, 1)[0]
          _this.data.splice(newIndex, 0, currRow)
        }
      })
    },
    columnDrop() {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.dropCol[evt.oldIndex]
          this.dropCol.splice(evt.oldIndex, 1)
          this.dropCol.splice(evt.newIndex, 0, oldItem)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

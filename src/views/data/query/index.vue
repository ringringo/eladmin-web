<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <!--表单组件-->
    <el-table ref="table" v-loading="loading" :data="data" highlight-current-row size="small" style="width: 100%;" @cell-dblclick="openQuery">
      <el-table-column prop="id" label="表名" />
      <el-table-column prop="name" label="中文名" />
      <el-table-column prop="datasize" label="数据量" width="80" />
      <el-table-column prop="source" label="来源" width="80" />
      <el-table-column v-if="checkPermission(['admin','dataEntity:edit','dataEntity:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" style="margin-left: -1px;margin-right: 2px" type="text">
            <router-link :to="'data/query/query/' + scope.row.id">
              查询
            </router-link>
          </el-button>
        </template>
      </el-table-column>
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
import crudDataEntity from '@/api/data/dataEntity'
export default {
  mixins: [crud],
  data() {
    return {
      title: 'meta',
      syncDialog: false,
      crudMethod: { ...crudDataEntity },
      form: { id: null, name: null, remark: null, datasize: null, source: null },
      rules: {
        id: [
          { required: true, message: '表名不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '中文名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/dataEntity'
      const sort = 'source,sort,asc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    },
    openQuery(row) {
      console.log(row)
      console.log(this.$router)
      this.$router.push({ path: '/query', params: { userId: 'ffff' }})
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <condition ref="cndFrm" :columns="tableColumnList" />
      <el-button style="float: left;" size="mini" type="success" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <!--表单组件-->
    <el-table ref="multipleTable" v-loading="listLoading" :data="dataList" stripe border size="small" style="width: 100%;">
      <el-table-column v-for="item in tableColumnList" :key="item.code" :label="item.name" :property="item.code" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <div class="block">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        style="margin-top: 8px;"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="sizeChangeHandler"
        @current-change="pageChangeHandler"
      />
    </div>
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudDataEntity from '@/api/data/dataEntity'
import crudDataColumn from '@/api/data/dataColumn'
import condition from './condition'
export default {
  components: { condition },
  mixins: [crud],
  data() {
    return {
      total: 0,
      page: 1,
      title: 'meta',
      syncDialog: false,
      form: { id: null, name: null, remark: null, datasize: null, source: null },
      rules: {
        id: [
          { required: true, message: '表名不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '中文名不能为空', trigger: 'blur' }
        ]
      },
      listLoading: false,
      tableColumnList: [],
      dataList: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.queryColumns()
    })
  },
  methods: {
    pageChangeHandler(e) {
      this.page = e
      this.doQueryData()
    },
    sizeChangeHandler(e) {
      this.size = e
      this.page = 1
      this.doQueryData()
    },
    queryColumns() {
      const param = {
        page: 0,
        size: 100,
        sort: 'sort,asc',
        entity: this.$route.params.tableName

      }
      crudDataColumn.getColumns(param).then(res => {
        this.tableColumnList = res.content
        this.doQueryData()
      })
    },
    search() {
      this.page = 1
      this.doQueryData()
    },
    doQueryData() {
      const param = {
        page: this.page,
        size: this.size,
        entity: this.$route.params.tableName,
        conditions: this.$refs.cndFrm.getCnd()
      }
      crudDataEntity.queryData(param).then(res => {
        this.dataList = res.content
        this.total = res.totalElements
      })
    }
  }
}
</script>

<style scoped>

</style>

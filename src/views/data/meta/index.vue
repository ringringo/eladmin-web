<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="9">
        <!--工具栏-->
        <div class="head-container">
          <el-row :gutter="10">
            <el-col><!-- 搜索 -->
              <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
              <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
                <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
              <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col><!-- 搜索 -->
              <!-- 新增 -->
              <el-button v-permission="['admin','dataEntity:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="showAddFormDialog">新增</el-button>
              <!-- 导出 -->
              <el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="downloadMethod">导出</el-button>
              <!-- 多选删除 -->
              <el-button v-permission="['admin','dataEntity:del']" :loading="delAllLoading" :disabled="data.length === 0 || $refs.table.selection.length === 0" class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="beforeDelAllMethod">删除</el-button>
              <!--表单组件-->
              <el-button v-permission="['admin','dataEntity:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="syncSource">同步数据源</el-button>
            </el-col>
          </el-row>
          <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="getFormTitle()" width="500px">
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
              <el-form-item label="表名" prop="id">
                <el-input v-model="form.id" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="中文名" prop="name">
                <el-input v-model="form.name" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="form.remark" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="数据量">
                <el-input v-model="form.datasize" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="来源">
                <el-input v-model="form.source" style="width: 370px;" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="text" @click="cancel">取消</el-button>
              <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
            </div>
          </el-dialog>
          <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="closeSync" :visible.sync="syncDialog" title="同步数据源" width="1000px">
            <source-form />
            <div slot="footer" class="dialog-footer">
              <el-button type="text" @click="closeSync">关闭</el-button>
            </div>
          </el-dialog>
          <!--表格渲染-->
          <el-table ref="table" v-loading="loading" :data="data" highlight-current-row size="small" style="width: 100%;" @current-change="selectEntity">
            <el-table-column prop="id" label="表名" />
            <el-table-column prop="name" label="中文名" />
            <el-table-column prop="datasize" label="数据量" width="80" />
            <el-table-column prop="source" label="来源" width="80" />
            <el-table-column v-if="checkPermission(['admin','dataEntity:edit','dataEntity:del'])" label="操作" width="150px" align="center">
              <template slot-scope="scope">
                <el-button v-permission="['admin','dataEntity:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
                <el-popover
                  :ref="scope.row.id"
                  v-permission="['admin','dataEntity:del']"
                  placement="top"
                  width="180"
                >
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
                </el-popover>
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
      </el-col>
      <el-col :span="15">
        <columnInfo ref="columns" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudDataEntity from '@/api/data/dataEntity'
import columnInfo from './column'
import sourceForm from './source'
export default {
  components: { columnInfo, sourceForm },
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
      },
      queryTypeOptions: [
        { key: 'id', display_name: '表名' },
        { key: 'name', display_name: '中文名' }
      ]
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
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      return true
    },
    selectEntity(row) {
      this.$refs.columns.doQuery(row.id)
    },
    syncSource() {
      this.syncDialog = true
    },
    closeSync() {
      this.syncDialog = false
      this.init()
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <el-button v-permission="['admin','dataColumn:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="showAddFormDialog">新增</el-button>
      <!-- 导出 -->
      <el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="downloadMethod">导出</el-button>
      <!-- 多选删除 -->
      <el-button v-permission="['admin','dataColumn:del']" :loading="delAllLoading" :disabled="data.length === 0 || $refs.table.selection.length === 0" class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="beforeDelAllMethod">
        删除
      </el-button>
      <!--表单组件-->
      <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="getFormTitle()" width="800px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-col :span="12">
            <el-form-item label="表名" prop="entity">
              <el-input v-model="form.entity" />
            </el-form-item>
            <el-form-item label="字段名" prop="code">
              <el-input v-model="form.code" />
            </el-form-item>
            <el-form-item label="中文名" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="数据类型" prop="dataType">
              <el-input v-model="form.dataType" />
            </el-form-item>
            <el-form-item label="字段长度" prop="length">
              <el-input-number v-model="form.length" />
            </el-form-item>
            <el-form-item label="字段精度" prop="scale">
              <el-input-number v-model="form.scale" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否主键" prop="isKey">
              <el-select v-model="form.isKey" placeholder="请选择">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="对象" hidden="true">
              <el-input v-model="form.obj" />
            </el-form-item>
            <el-form-item label="对象属性" hidden="true">
              <el-input v-model="form.objProp" />
            </el-form-item>
            <el-form-item label="数据粒度">
              <el-input v-model="form.dataLevel" hidden="true" />
            </el-form-item>
            <el-form-item label="敏感字段" prop="isSensitive">
              <el-select v-model="form.isSensitive" placeholder="请选择">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="显示顺序" prop="sort">
              <el-input-number v-model="form.sort" />
            </el-form-item>
            <el-form-item label="权限字段" prop="isAuthority">
              <el-select v-model="form.isAuthority" placeholder="请选择">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否有效" prop="isValid">
              <el-select v-model="form.isValid" placeholder="请选择">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column prop="code" label="字段名" />
        <el-table-column prop="name" label="中文名" />
        <el-table-column prop="dataType" label="数据类型" />
        <el-table-column prop="length" label="字段长度" width="50" />
        <el-table-column prop="scale" label="字段精度" width="50" />
        <el-table-column :formatter="renderYesNo" prop="isKey" label="是否主键" width="50" />
        <el-table-column v-if="false" prop="obj" label="对象" width="50" />
        <el-table-column v-if="false" prop="objProp" label="对象属性" width="50" />
        <el-table-column v-if="false" prop="dataLevel" label="数据粒度" width="50" />
        <el-table-column :formatter="renderYesNo" prop="isSensitive" label="敏感字段" width="50" />
        <el-table-column :formatter="renderYesNo" prop="isAuthority" label="权限字段" width="50" />
        <el-table-column :formatter="renderYesNo" prop="isValid" label="是否有效" width="50" />
        <el-table-column prop="sort" label="显示顺序" width="50" />
        <el-table-column v-if="checkPermission(['admin','dataColumn:edit','dataColumn:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['admin','dataColumn:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
            <el-popover
              :ref="scope.row.entity + '_' + scope.row.code "
              v-permission="['admin','dataColumn:del']"
              placement="top"
              width="180"
            >
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.entity + '_' + scope.row.code ].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="delMethodMulId({ entity:scope.row.entity, code:scope.row.code }, scope.row.entity + '_' + scope.row.code)">确定</el-button>
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
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudDataColumn from '@/api/data/dataColumn'
export default {
  mixins: [crud],
  data() {
    return {
      title: 'column',
      entity: '',
      crudMethod: { ...crudDataColumn },
      form: {
        entity: null,
        code: null,
        name: null,
        dataType: null,
        length: null,
        scale: null,
        isKey: null,
        obj: null,
        objProp: null,
        dataLevel: null,
        isSensitive: null,
        sort: null,
        isAuthority: null,
        isValid: null
      },
      rules: {
        entity: [
          { required: true, message: '元数据编号不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '字段名不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '中文名不能为空', trigger: 'blur' }
        ],
        dataType: [
          { required: true, message: '数据类型不能为空', trigger: 'blur' }
        ],
        length: [
          { required: true, message: '字段长度不能为空', trigger: 'blur' }
        ],
        scale: [
          { required: true, message: '字段精度不能为空', trigger: 'blur' }
        ],
        isKey: [
          { required: true, message: '是否主键不能为空', trigger: 'blur' }
        ],
        isSensitive: [
          { required: true, message: '是否是敏感字段不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '显示顺序不能为空', trigger: 'blur' }
        ],
        isAuthority: [
          { required: true, message: '权限字段不能为空', trigger: 'blur' }
        ],
        isValid: [
          { required: true, message: '是否有效不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'code', display_name: '字段名' },
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
      this.url = 'api/dataColumn'
      const sort = 'sort,asc'
      if (!this.entity) {
        this.loading = false
        return false
      }
      this.params = { page: this.page, size: this.size, sort: sort, entity: this.entity }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      return true
    },
    doQuery(entity) {
      this.entity = entity
      this.toQuery()
    },
    renderYesNo(row, column, cellValue, index) {
      if (cellValue === '1') {
        return '是'
      } else {
        return '否'
      }
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" align="right">
      <!-- 生成代码 -->
      <el-button v-permission="['admin','genCustom:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" plain @click="showGenerateDialog">生成代码</el-button>
      <!-- 切换布局 -->
      <el-button v-permission="['admin','genCustom:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" plain @click="showAddFormDialog">切换布局</el-button>
      <!-- 切换布局 -->
      <el-button v-permission="['admin','genCustom:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" plain @click="showAddFormDialog">参数设置</el-button>
      <!-- 保存 -->
      <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download" plain @click="showSave">保存</el-button>
      <!-- 新建模块 -->
      <el-button v-permission="['admin','genCustom:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" plain @click="showAdd">新建模块</el-button>
      <!-- 已有模块 -->
      <el-button v-permission="['admin','genCustom:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" plain @click="showDataSource">已有模块</el-button>
    </div>
    <!--数据源-->
    <el-dialog :close-on-click-modal="false" :visible.sync="addDialog" :modal="false" :show-close="false" title="新建模块" width="1000px">
      <add-form ref="addForm" :columns="columns" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="queryData">确认</el-button>
        <el-button type="text" @click="closeAdd">关闭</el-button>
      </div>
    </el-dialog>
    <!--数据源-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :visible.sync="selectDialog" :modal="false" :show-close="false" title="同步数据源" width="400px">
      <source-form />
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closeSelect">关闭</el-button>
      </div>
    </el-dialog>
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <search v-if="crud.props.searchToggle && searchColumns.length>0" :columns="searchColumns" />
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
      <el-form ref="dynamicForm" size="small" label-width="80px">
        <el-form-item v-for="tableColumn in columns" :key="tableColumn.columnName" :label="tableColumn.remark" :prop="tableColumn.columnName">
          <el-input v-model="form[tableColumn.columnName]" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--代码生成-->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="generateDialog" title="代码生成" width="500px">
      <el-form ref="save" :model="generate" :rules="rules" size="small" label-width="80px">
        <el-form-item label="包名" prop="package">
          <el-input v-model="generate.package" placeholder="包名,例如：system.user" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="generateCancel">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="doGenerate">确认</el-button>
      </div>
    </el-dialog>
    <!--保存组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="saveDialog" title="保存" width="500px">
      <el-form ref="save" :model="save" :rules="rules" size="small" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="save.name" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="saveCancel">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="saveSubmit">确认</el-button>
      </div>
    </el-dialog>
    <el-table ref="table" v-loading="listLoading" :data="dataList" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column v-for="item in columns" :key="item.columnName" :label="item.remark" :property="item.columnName" sortable align="center">
        <template slot-scope="scope">
          <span v-if="item.dictName && dict.label[item.dictName]">{{ dict.label[item.dictName][scope.row[scope.column.property]] }}</span>
          <span v-else-if="item.columnType == &quot;datetime&quot; && scope.row[scope.column.property]">{{ parseTime(scope.row[scope.column.property]) }}</span>
          <span v-else>{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','genCustom:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
          <el-popover
            :ref="genId(scope.row)"
            v-permission="['admin','genCustom:del']"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[genId(scope.row)].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
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
import crudDept from '@/api/system/dept'
import sourceForm from './source'
import search from './search'
import addForm from './add'
import { queryData, delData, save, get, generate } from '@/api/generator/genCustom'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import Dict from '@/components/Dict/Dict'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '', url: 'api/dept', crudMethod: { ...crudDept }})
const defaultForm = { id: null, name: null, pid: 1, enabled: 'true' }
export default {
  components: { sourceForm, addForm, crudOperation, search },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: [],
  data() {
    return {
      queryParam: {},
      delLoading: false,
      total: 0,
      page: 1,
      size: 10,
      title: 'meta',
      selectDialog: false,
      generateDialog: false,
      addDialog: false,
      form: { id: null, name: null },
      save: { id: null, name: null },
      generate: { package: null },
      saveDialog: false,
      dict: {
        dict: {},
        label: {}
      },
      rules: {
        id: [
          { required: true, message: '表名不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '中文名不能为空', trigger: 'blur' }
        ],
        package: [
          { required: true, message: '包名不能为空', trigger: 'blur' }
        ]
      },
      listLoading: false,
      columns: [],
      searchColumns: [],
      dataList: [],
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      }
    }
  },
  created() {
    this.$nextTick(() => {
      const id = this.$route.params.id
      if (id && id !== 'new') {
        get(id).then(res => {
          const contentObj = JSON.parse(res.content)
          this.columns = contentObj.columns
          this.getSearchColumns(contentObj.columns)
          this.setTableColumnsToggle(contentObj.columns)
          this.queryParam = contentObj.queryParam
          this.form = contentObj.form
          this.save = contentObj.save
          this.save.id = id
          this.initDict(this.columns)
          this.toQuery()
        }).catch(err => {
          console.log(err.response.data.message)
        })
      }
    })
  },
  methods: {
    [CRUD.HOOK.beforeDelete](crud, datas) {
      this.delAllMethod(datas)
      return false
    },
    [CRUD.HOOK.beforeRefresh](crud, datas) {
      this.toQuery()
      return false
    },
    [CRUD.HOOK.beforeToEdit](crud, datas) {
      this.crud.status.edit = CRUD.STATUS.PREPARED
      this.form = datas
      return false
    },
    [CRUD.HOOK.beforeToAdd](crud, datas) {
      crud.status.add = CRUD.STATUS.PREPARED
      this.form = {}
      return false
    },
    [CRUD.HOOK.beforeToAdd](crud, datas) {
      crud.status.add = CRUD.STATUS.PREPARED
      this.form = {}
      return false
    },
    [CRUD.HOOK.beforeAddCancel](crud, datas) {
      crud.status.add = CRUD.STATUS.NORMAL
      this.form = {}
      return false
    },
    [CRUD.HOOK.beforeEditCancel](crud, datas) {
      crud.status.edit = CRUD.STATUS.NORMAL
      this.form = {}
      return false
    },
    initDict(columns) {
      for (let i = 0; i < this.columns.length; i++) {
        const dictName = this.columns[i].dictName
        if (dictName) {
          this.$options.dicts.push(dictName)
        }
      }
      new Dict(this.dict).init(this.$options.dicts, () => {
        this.$nextTick(() => {
          this.$emit('dictReady')
        })
      })
    },
    showEditFormDialog(datas) {
      this.crud.status.edit = CRUD.STATUS.PREPARED
      this.form = datas
      return false
    },
    showAddFormDialog() {
      this.page = 1
      this.queryData()
    },
    toQuery() {
      this.page = 1
      this.queryData()
    },
    pageChangeHandler(e) {
      this.page = e
      this.queryData()
    },
    sizeChangeHandler(e) {
      this.size = e
      this.page = 1
      this.queryData()
    },
    search() {
      this.page = 1
      this.queryData()
    },
    showDataSource() {
      this.selectDialog = true
    },
    showGenerateDialog() {
      this.generateDialog = true
    },
    generateCancel() {
      this.generateDialog = false
    },
    showAdd() {
      this.addDialog = true
    },
    closeAdd() {
      this.addDialog = false
    },
    closeSelect() {
      this.selectDialog = false
    },
    getSearchColumns(data) {
      this.searchColumns = []
      for (const idx in data) {
        const column = data[idx]
        if (idx === '0') {
          this.setGeneratePackage(column)
        }
        if (column.queryType) {
          this.searchColumns.push(column)
        }
      }
    },
    setGeneratePackage(column) {
      const tableNameArray = column.tableName.split('_')
      if (tableNameArray.length > 1) {
        this.generate.package = tableNameArray[tableNameArray.length - 2] + '.' + tableNameArray[tableNameArray.length - 1]
      } else {
        this.generate.package = tableNameArray[0]
      }
    },
    setTableColumnsToggle(data) {
      const tableColumns = []
      for (const idx in data) {
        const column = data[idx]
        tableColumns.push({ label: column.remark, visible: true })
      }
      this.crud.updateProp('tableColumns', tableColumns)
    },
    queryData() {
      this.addDialog = false
      this.listLoading = true
      const data = this.$refs.addForm ? this.$refs.addForm.data : this.columns
      this.columns = data
      this.initDict(this.columns)
      this.setTableColumnsToggle(data)
      this.getSearchColumns(data)
      this.queryParam = {
        columnInfos: data,
        page: this.page,
        size: this.size
      }
      queryData(this.queryParam).then(res => {
        this.dataList = res.content
        this.total = res.totalElements
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
        console.log(err.response.data.message)
      })
    },
    delMethod(row) {
      this.delLoading = true
      const idList = []
      const pri = {}
      for (const idx in this.columns) {
        const column = this.columns[idx]
        if (column['keyType'] === 'PRI') {
          const columnName = column['columnName']
          pri[columnName] = row[columnName]
        }
      }
      idList.push(pri)
      delData({ queryBody: this.queryParam, idList: idList }).then(() => {
        this.delLoading = false
        this.$refs[this.genId(row)].doClose()
        this.crud.delSuccessNotify()
        this.toQuery()
      }).catch(() => {
        this.delLoading = false
        this.$refs[this.genId(row)].doClose()
      })
    },
    delAllMethod(rowList) {
      this.crud.delAllLoading = true
      const idList = []
      for (const inx in rowList) {
        const row = rowList[inx]
        const pri = {}
        for (const idx in this.columns) {
          const column = this.columns[idx]
          if (column['keyType'] === 'PRI') {
            const columnName = column['columnName']
            pri[columnName] = row[columnName]
          }
        }
        idList.push(pri)
      }
      delData({ queryBody: this.queryParam, idList: idList }).then(() => {
        this.crud.delAllLoading = false
        this.crud.delSuccessNotify()
        this.toQuery()
      }).catch(() => {
        this.crud.delAllLoading = false
      })
    },
    genId(row) {
      let pri = ''
      for (const idx in this.columns) {
        const column = this.columns[idx]
        if (column['keyType'] === 'PRI') {
          const columnName = column['columnName']
          pri += '_' + row[columnName]
        }
      }
      return pri
    },
    showSave() {
      this.saveDialog = true
    },
    saveCancel() {
      this.saveDialog = false
    },
    saveSubmit() {
      const contentObj = {
        columns: this.columns,
        queryParam: this.queryParam,
        pack: this.generate.package,
        form: this.form,
        save: this.save
      }
      const saveObj = { id: this.save.id, name: this.save.name, content: JSON.stringify(contentObj) }
      save(saveObj).then(() => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.saveDialog = false
      }).catch(() => {
        this.crud.delAllLoading = false
      })
    },
    doGenerate() {
      const contentObj = {
        columns: this.columns,
        queryParam: this.queryParam,
        form: this.form,
        pack: this.generate.package,
        save: this.save
      }
      generate(contentObj).then(() => {
        this.$message({
          message: '代码生成成功！',
          type: 'success'
        })
        this.generateDialog = false
      }).catch(() => {
        // this.crud.delAllLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>

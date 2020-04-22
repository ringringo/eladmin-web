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
      <el-button v-permission="['admin','genModuleConfig:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="showAddFormDialog">新增</el-button>
      <!-- 导出 -->
      <el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="downloadMethod">导出</el-button>
      <!-- 多选删除 -->
      <el-button v-permission="['admin','genModuleConfig:del']" :loading="delAllLoading" :disabled="data.length === 0 || $refs.table.selection.length === 0" class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="beforeDelAllMethod">删除</el-button>
      <!--表单组件-->
      <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="getFormTitle()" width="800px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="名称" prop="id">
            <el-input v-model="form.id" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="form.type" placeholder="表单类型">
              <el-option label="表格" value="Grid" />
              <el-option label="查询表单" value="QueryForm" />
              <el-option label="图表" value="Charts" />
            </el-select>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="form.content" :rows="6" type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="submitMethod">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="名称" />
        <el-table-column prop="name" label="描述" />
        <el-table-column prop="type" label="类型" />
        <el-table-column v-if="checkPermission(['admin','genModuleConfig:edit','genModuleConfig:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['admin','genModuleConfig:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
            <el-popover
              :ref="scope.row.id"
              v-permission="['admin','genModuleConfig:del']"
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
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudGenModuleConfig from '@/api/generator/genModuleConfig'
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
    }
  }
}
</script>

<style scoped>

</style>

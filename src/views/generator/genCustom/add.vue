<template>
  <el-row>
    <!--角色管理-->
    <el-col style="margin-bottom: 10px">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <el-select
            v-model="tableName"
            filterable
            placeholder="请选择表"
            :loading="loading"
            @change="selectTable"
          >
            <el-option
              v-for="item in tableList"
              :key="item.id"
              :label="item.id"
              :value="item.id"
            />
          </el-select>
        </div>
        <el-form size="small" label-width="90px">
          <el-table v-loading="loading" :data="data" :max-height="tableHeight" size="small" style="width: 100%;margin-bottom: 15px">
            <el-table-column prop="columnName" label="字段名称" />
            <el-table-column prop="columnType" label="字段类型" />
            <el-table-column prop="remark" label="字段描述">
              <template slot-scope="scope">
                <el-input v-model="data[scope.$index].remark" size="mini" class="edit-input" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="必填" width="70px">
              <template slot-scope="scope">
                <el-checkbox v-model="data[scope.$index].notNull" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="列表" width="70px">
              <template slot-scope="scope">
                <el-checkbox v-model="data[scope.$index].listShow" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="表单" width="70px">
              <template slot-scope="scope">
                <el-checkbox v-model="data[scope.$index].formShow" />
              </template>
            </el-table-column>
            <el-table-column label="表单类型">
              <template slot-scope="scope">
                <el-select v-model="data[scope.$index].formType" filterable class="edit-input" clearable size="mini" placeholder="请选择">
                  <el-option
                    label="文本框"
                    value="Input"
                  />
                  <el-option
                    label="文本域"
                    value="Textarea"
                  />
                  <el-option
                    label="单选框"
                    value="Radio"
                  />
                  <el-option
                    label="下拉框"
                    value="Select"
                  />
                  <el-option
                    label="日期框"
                    value="Date"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="查询方式">
              <template slot-scope="scope">
                <el-select v-model="data[scope.$index].queryType" filterable class="edit-input" clearable size="mini" placeholder="请选择">
                  <el-option
                    label="="
                    value="="
                  />
                  <el-option
                    label="!="
                    value="!="
                  />
                  <el-option
                    label=">="
                    value=">="
                  />
                  <el-option
                    label="<="
                    value="<="
                  />
                  <el-option
                    label="Like"
                    value="Like"
                  />
                  <el-option
                    label="BetWeen"
                    value="BetWeen"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="日期注解">
              <template slot-scope="scope">
                <el-select v-model="data[scope.$index].dateAnnotation" filterable class="edit-input" clearable size="mini" placeholder="请选择">
                  <el-option
                    label="自动创建时间"
                    value="CreationTimestamp"
                  />
                  <el-option
                    label="自动更新时间"
                    value="UpdateTimestamp"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="关联字典">
              <template slot-scope="scope">
                <el-select v-model="data[scope.$index].dictName" filterable class="edit-input" clearable size="mini" placeholder="请选择">
                  <el-option v-for="item in dicts" :key="item.id" :label="item.remark === '' ? item.name : item.remark" :value="item.name" />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import crud from '@/mixins/crud'
import { update, get } from '@/api/generator/genConfig'
import { save } from '@/api/generator/generator'
import { queryTableList } from '@/api/data/dataEntity'
import { getDicts } from '@/api/system/dict'
export default {
  name: 'GeneratorConfig',
  components: {},
  mixins: [crud],
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
      activeName: 'first', tableName: '', tableHeight: 550, columnLoading: false, configLoading: false, dicts: [],
      tableList: []
    }
  },
  created() {
    this.tableHeight = document.documentElement.clientHeight - 355
    this.loading = false
    getDicts().then(data => {
      this.dicts = data
    })
    this.$nextTick(() => {
      queryTableList().then(data => {
        this.tableList = data
      })
      this.data = this.columns
    })
  },
  methods: {
    selectTable() {
      this.loading = true
      this.init()
      get(this.tableName).then(data => {
        this.form = data
        this.form.cover = this.form.cover.toString()
      })
    },
    beforeInit() {
      this.url = 'api/generator/columns'
      const tableName = this.tableName
      this.params = { tableName }
      return true
    },
    saveColumnConfig() {
      this.columnLoading = true
      save(this.data).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.columnLoading = false
        this.$router.push({ path: '../run/' + this.tableName })
      }).catch(err => {
        this.columnLoading = false
        console.log(err.response.data.message)
      })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.configLoading = true
          update(this.form).then(res => {
            this.$notify({
              title: '保存成功',
              type: 'success',
              duration: 2500
            })
            this.form = res
            this.form.cover = this.form.cover.toString()
            this.configLoading = false
          }).catch(err => {
            this.configLoading = false
            console.log(err.response.data.message)
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .edit-input {
    .el-input__inner {
      border: 1px solid #e5e6e7;
    }
  }
</style>

<style scoped>
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>

<template>
  <div>
    <div class="wrapper">
      <el-row>
        <h4>填写须知</h4>
        <p>1.车架号和借出日期必填；</p>
        <p>2. 车架号满足17位长度要求且只能填写数字和字母；</p>
        <p>3. 借出日期请填写年-月-日 格式；</p>
        <p>4. 备注信息最多填写50个汉字，支持填写中英文数字及标点符号；</p>
      </el-row>
      <el-row class="example-div">
        <h4>示例</h4>
        <table border="1" cellspacing="0" cellpadding="0">
          <tr>
            <th>车架号*</th>
            <th>借出日期*</th>
            <th>备注</th>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </el-row>
    </div>
    <el-row class="upload-result-div">
      <el-dialog :lock-scroll="true" :visible="resDialogVisible" @close="resDialogVisible = false" :modal="false" center
                 class="res-dialog">
        <el-row class="res-msg">{{ res.msg }}</el-row>
        <el-row class="res-num" v-if="resNumVisible">
          <div class="res-num-text">导入成功条数：{{ res.data.sucNum }}</div>
          <div class="res-num-text">导入失败条数: {{ res.data.errNum }}</div>
        </el-row>
        <el-row v-if="resDetailBtnVisible">
          <em>
            <el-button type="text" class="res-detail-btn" @click="downloadResultExcel">请点击下载导入结果</el-button>
          </em>
        </el-row>
        <el-row class="res-detail" v-if="resDetailVisible" v-html="res.data.detailMsg"></el-row>

        <el-row style="display: none;">
          <table id="resDetailTable">
            <thead>
            <tr>
              <th width='600px'>车架号*</th>
              <th width='300px'>借出日期*</th>
              <th width='300px'>备注</th>
              <th width='500px'>错误原因</th>
            </tr>
            </thead>
            <tbody v-html="resDetailTableHtml">
            </tbody>
          </table>
        </el-row>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import moment from 'moment'

export default {
  data () {
    return {
      // 是否展示选择的文件
      showFileList: true,
      // 是否开启操作结果的下载按钮
      openResDetailBtnVisible: true,
      // 是否开启操作结果（成功/失败条数）的展示
      openResNumVisible: true,
      action: '/wapi/archives/batchLendImportController',
      fileList: [],
      paramData: {},

      resNumVisible: false,
      resDetailBtnVisible: true,
      resDetailVisible: false,
      resDialogVisible: false,
      res: {msg: '', result: '', data: {}},
      resDetailTableHtml: ''
    }
  },
  mounted () {
    this.setPageTitle('批量借出')
  },
  computed: {
    submitBtnDisabled: function () {
      if (!this.fileList || this.fileList.length <= 0) {
        return true
      }
      var file = this.fileList[0]
      if (file.status !== 'ready') {
        return true
      }
      return false
    }
  },
  methods: {
    handleBeforeUpload () {
      var result = false

      var fileName = this.paramData.fileName || ''
      var fileList = this.fileList
      // 后缀
      var suffix = fileName.split('.')[fileName.split('.').length - 1]
      // var fileRealName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.lastIndexOf('.'))  文件名
      suffix = suffix.toLowerCase()

      if (!fileName || fileList.length <= 0) {
        this.$message.info('上传文件不能为空,请选择后上传！')
      } else if (suffix !== 'xls' && suffix !== 'xlsx') {
        this.$message.info('文件类型错误.请重新选择！')
      } else {
        result = true
      }

      var fileSize = fileList[0].size
      if (fileSize > 10 * 1024 * 1024) {
        this.$message.info('导入文件大小不能大于10M')
        result = false
      }

      return result
    },
    handleExceed (files, fileList) {
      // 防止使用拖拉方式时，拖拉多个文件文件
      if (files.length > 1 || fileList.length > 1) {
        this.$message.info('只能单文件上传!请重新选择')
      }
      // 拖拉多个文件时，不做处理
      if (files.length > 1) {
        return
      }

      for (let i = 0, len = fileList.length; i < len; i++) {
        this.$refs.upload.handleRemove(fileList[i])
      }
      this.$refs.upload.$children[0].uploadFiles(files)
    },
    handleRemove () {
      // 数组清空
      this.fileList = []
    },
    handleSuccess (res, file, fileList) {
      if (!res) {
        this.$message.info('数据请求错误')
      }
      var resData = {}
      if (res.resData) {
        resData = JSON.parse(res.resData)
      }

      if (!resData.detailMsg) {
        resData.detailMsg = this.createResDetailByItems(resData.items)
      }
      this.res.msg = res.msg
      this.res.result = res.result
      this.res.data = resData
      this.resDetailTableHtml = this.createResTableByItems(resData.items)
      this.resDialogVisible = true
      this.resNumVisible = (this.openResNumVisible && resData.sumNum && resData.sumNum > 0)
      this.resDetailVisible = Boolean(resData.detailMsg).valueOf()
      this.resDetailBtnVisible = Boolean(this.openResDetailBtnVisible && this.resDetailTableHtml).valueOf()
      if (!this.resDetailBtnVisible && this.resNumVisible) {
        if (window.opener && !window.opener.closed) {
          window.opener.location.reload()
        }
      }
    },
    handleError (err, file, fileList) {
      console.log(err)
    },
    handleFileChange (file) {
      if (file && file.status === 'ready') {
        this.paramData.fileName = file.name
        this.fileList = [file]
      }
    },
    downloadModelHandle () {
      window.open('/wapi/excelTmpl/downloadBatchLendArchives.do')
    },
    closeUploadHandle () {
      window.close()
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    createResDetailByItems (items) {
      var detailMsg = ''
      if (items && items.length > 0) {
        for (var i = 0; i < items.length; i++) {
          var item = items[i]
          if (item.result) {
            continue
          }
          if (!item.index && !item.key) {
            continue
          }
          detailMsg += '第' + item.index + '行：'
          if (item.key) {
            detailMsg += '<b>' + item.key + '</b>'
          }
          detailMsg += item.msg + '!</br>'
        }
      }
      return detailMsg
    },
    createResTableByItems (items) {
      var hasErr = false
      var tableHtml = ''
      if (items && items.length > 0) {
        for (var i = 0; i < items.length; i++) {
          var item = items[i]
          var frameNo = item.frameNo || ''
          var lendingDate = this.dateTimeFormat(item.lendingDate) || ''
          var remark = item.remark || ''
          var msg = item.msg || ''
          tableHtml += '<tr>'
          tableHtml += '<td>' + frameNo + '</td>'
          tableHtml += '<td>' + lendingDate + '</td>'
          tableHtml += '<td>' + remark + '</td>'
          tableHtml += '<td>' + msg + '</td>'
          tableHtml += '</tr>'
          if (item.msg) {
            hasErr = true
          }
        }
      }
      // 如果导入的结果都是正确的，就无须创建错误信息表格
      if (!hasErr) {
        tableHtml = ''
      }
      return tableHtml
    },
    // 格式化时间
    dateTimeFormat (val) {
      if (val === null || val === '' || val === undefined) {
        return null
      }
      return moment(val).format('YYYY-MM-DD')
    },
    downloadResultExcel () {
      // 转换成excel时，使用原始的格式
      var xlsxParam = { raw: true }
      let wb = XLSX.utils.table_to_book(document.querySelector('#resDetailTable'), xlsxParam)
      /* get binary string as output */
      let wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'})
      try {
        FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '导入批量操作错误列表.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    }

  }
}
</script>

<style>
  .el-upload-button {
    margin-top: 136px;
    z-index: 8013;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }

  .upload-result-div {
    z-index: 8014;
  }

  .res-dialog .el-dialog.el-dialog--center {
    border-radius: 2px;
    box-shadow: -0.1px -0.1px 5px 6px rgba(0, 0, 0, .3);
    box-sizing: border-box;
    width: 430px;
    min-height: 250px;
  }

  .upload .el-upload-list.el-upload-list--text {
    width: 360px;
    position: relative;
    left: 50%;
    transform: translate(-50%);
  }

  .res-msg {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .res-num {
    margin-bottom: 8px;
  }

  .res-detail-btn {
    padding: 0;
    margin-bottom: 8px;
  }

  .res-detail {
    max-height: 200px;
    height: auto;
    overflow-y: auto;
  }
  .wrapper{
    width: 800px;
    margin: 0 auto;
  }
  .remark-div,.example-div{
    margin-top: 20px;
  }
  .remark-div h4, .example-div h4{
    border-left: 5px solid #23cdb4;
    padding-left: 5px;
    margin-bottom: 0;
  }
  .remark-div p{
    margin-top: 5px;
    margin-bottom: 0;
  }
  .example-div table {
    width: 100%;
    margin-top: 5px;
  }
  .example-div table th,.example-div table td{
    padding: 5px;
  }

</style>

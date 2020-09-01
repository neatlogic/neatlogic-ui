import axios from '@api/http.js';

const download = {
  bind(el, binding) {
    if (!binding.arg && binding.value) {
      el.downparam = binding.value;
    }
    const downloadUrl = function(params) {
      let url = ''; let param = {};
      //传过来的参数有可能是地址也可能是地址+参数，数据格式为：{url:地址，params:{参数}}
      if (typeof params !== 'string') {
        url = params.url;
        param = params.params;
      } else {
        url = params;
      }
      axios
        .post(url, param, {responseType: 'blob'})
        .then(res => {
          el._tsDownloadsuccess_ && el._tsDownloadsuccess_();
          if (res.status == '200') {
            const aLink = document.createElement('a');
            let blob = new Blob([res.data], {
              type: 'application/x-msdownload'
            });
            aLink.href = URL.createObjectURL(blob);
            //content-disposition的返回数据格式为: attachment;fileName="名字“ ，通过截取长度获取名字
            let contentDisposition = decodeURI(res.headers['content-disposition']);
            let fileName = contentDisposition.substring(21, contentDisposition.length - 1);
            aLink.download = fileName;
            aLink.click();
            document.body.appendChild(aLink);
          }
        })
        .catch(error => {
          el._tsDownloaderror_ && el._tsDownloaderror_();
          // if (el.dataset.downloadErrorHandler) {
          //   el.dataset.downloadErrorHandler;
          // }
          this.$Notice.error({
            title: '错误信息',
            desc: error.data.Message
          });
        }); 
    };

    const clickDownload = function(e) {
      //这里的先判断是否有拓展参数再根据拓展参数写死判断是成功还是失败事件（不然会有值错误或者方法返回错误导致的异常和脚本注入）
      if (!binding.arg) {
        if (el.downparam) {
          downloadUrl(el.downparam);
        } else {
          console.error('缺少下载地址');
        }
      } else {
        if (binding.arg) {
          if (typeof binding.value === 'function') {
            if (binding.arg == 'error') {
              el._tsDownloaderror_ = binding.value;
            } else if (binding.arg == 'success') {
              el._tsDownloadsuccess_ = binding.value;
            }
          }
        }
      }
    };
    el._tsDownloadresource_ = clickDownload;
    el.addEventListener('click', clickDownload);
  },
  update(el, binding) {
    //如果数据更新了需要对应更新
    if (!binding.arg && JSON.stringify(binding.oldValue) != JSON.stringify(binding.value)) {
      el.downparam = binding.value;
    }
  },
  unbind(el, binding) {
    el._tsDownloaderror_ && delete el._tsDownloaderror_;
    el._tsDownloadsuccess_ && delete el._tsDownloadsuccess_;
    if (el._tsDownloadresource_) {
      el.removeEventListener('click', el._tsDownloadresource_);
      delete el._tsDownloadresource_;
      delete el.downparam;
    }
  }
};
export default download;


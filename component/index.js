import Vue from 'vue';

import Loading from './Loading/Loading.vue';
import NoData from './NoData/NoData.vue';
import TimeSelect from './TimeSelect/TimeSelect.vue';
import TsBebouchSearch from './TsBebouchSearch/TsBebouchSearch.vue';
import TsBreadcrumb from './TsBreadcrumb/TsBreadcrumb.vue';
import TsCard from './TsCard/TsCard.vue';
import TsCkeditor from './TsCkeditor/TsCkeditor.vue';
import TsCodemirror from './TsCodemirror/TsCodemirror.vue';
import TsContain from './TsContain/TsContain.vue';
import TsDialog from './TsDialog/TsDialog.vue';
import TsForm from './TsForm/TsForm.vue';
import TsLayout from './TsLayout/TsLayout.vue';
import TsQuartz from './TsQuartz/TsQuartz.vue';
import TsRow from './TsRow/TsRow.vue';
import TsTable from './TsTable/TsTable.vue';
import TsUlList from './TsUlList/TsUlList.vue';
import UpLoad from './UpLoad/UpLoad.vue';
import UploadDialog from './UploadDialog/UploadDialog.vue';
import UserCard from './UserCard/UserCard.vue';
import UserSelect from './UserSelect/UserSelect.vue';
import TsZtree from './TsZtree/TsZtree.vue';
import TsFormInput from './TsForm/TsFormInput';
import TsFormSelect from './TsForm/TsFormSelect';
import TsFormRadio from './TsForm/TsFormRadio';
import TsFormCheckbox from './TsForm/TsFormCheckbox';
import TsFormDatePicker from './TsForm/TsFormDatePicker';
import TsFormTree from './TsForm/TsFormTree';
import TsFormSwitch from './TsForm/TsFormSwitch';

const components = {
  Loading,
  NoData,
  TimeSelect,
  TsBebouchSearch,
  TsBreadcrumb,
  TsCard,
  TsCkeditor,
  TsCodemirror,
  TsContain,
  TsDialog,
  TsForm,
  TsLayout,
  TsQuartz,
  TsRow,
  TsTable,
  TsUlList,
  UpLoad,
  UploadDialog,
  UserCard,
  UserSelect,
  TsZtree,
  TsFormInput,
  TsFormSelect,
  TsFormRadio,
  TsFormCheckbox,
  TsFormDatePicker,
  TsFormTree,
  TsFormSwitch
};
TsDialog.install = function(_Vue, options) {
  _Vue.prototype.$createDialog = config => {
    let instance = null;
    const TsDialogConstructor = _Vue.extend(TsDialog);
    config.isShow = true;
    config.width = config.width || '500px';
    config.type = config.type || 'modal';
    !config.title && (config.hasHeader = false);
    let oDiv = document.createElement('div');
    document.body.appendChild(oDiv);
    instance = new TsDialogConstructor({ propsData: config }).$mount(oDiv);
    Object.assign(instance, config);
    instance.closeDailog = function() {
      config.isShow = false;
      instance.isShow = false;
    };
  };
};
Object.keys(components).forEach(name => {
  Vue.component(name, components[name]);
});

export default components;

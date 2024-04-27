import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-light-green/theme.css'

import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import Menubar from 'primevue/menubar';
import Badge from 'primevue/badge';
import BadgeDirective from 'primevue/badgedirective';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';
import Ripple from 'primevue/ripple';
import Card from 'primevue/card';
import FileUpload from 'primevue/fileupload';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row';     
import Rating from 'primevue/rating';  
import Dialog from 'primevue/dialog';   
import Textarea from 'primevue/textarea';   
import Dropdown from 'primevue/dropdown';   
import RadioButton from 'primevue/radiobutton';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Tag from 'primevue/tag';
import InputNumber from 'primevue/inputnumber';
import Fieldset from 'primevue/fieldset';
import Chip from 'primevue/chip';
import DataView from 'primevue/dataview';
import Image from 'primevue/image';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import Sidebar from 'primevue/sidebar';
import ColorPicker from 'primevue/colorpicker';
import InputSwitch from 'primevue/inputswitch';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import TieredMenu from 'primevue/tieredmenu'
import InputMask from 'primevue/inputmask'
import SelectButton from 'primevue/selectbutton'
import ConfirmDialog from 'primevue/confirmdialog';
import Paginator from 'primevue/paginator';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastService);
app.use(ConfirmationService);
app.use(PrimeVue, { 
    ripple: true, 
    zIndex: {
    modal: 1100,        
    overlay: 1000,      
    menu: 1000,         
    tooltip: 1100       
} })

app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);

app.component('SelectButton', SelectButton)
app.component('InputMask', InputMask)
app.component('TieredMenu', TieredMenu)
app.component('Button', Button)
app.component('InputText', InputText);
app.component('Menubar', Menubar);
app.component('Badge', Badge);
app.component('Avatar', Avatar);
app.component('AvatarGroup', AvatarGroup);
app.component('Card', Card);
app.component('FileUpload', FileUpload);
app.component('Toolbar', Toolbar);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Rating', Rating);
app.component('Dialog', Dialog);
app.component('Textarea', Textarea);
app.component('Dropdown', Dropdown);
app.component('RadioButton', RadioButton);
app.component('Toast', Toast);
app.component('Tag', Tag);
app.component('InputNumber', InputNumber);
app.component('Fieldset', Fieldset);
app.component('Chip', Chip);
app.component('DataView', DataView);
app.component('Image', Image);
app.component('Calendar', Calendar);
app.component('Checkbox', Checkbox);
app.component('Sidebar', Sidebar);
app.component('ColorPicker', ColorPicker);
app.component('InputSwitch', InputSwitch)
app.component('ConfirmPopup', ConfirmPopup)
app.component('InputGroup', InputGroup)
app.component('InputGroupAddon', InputGroupAddon)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Paginator', Paginator)

app.mount('#app')


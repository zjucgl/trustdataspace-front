// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { addIcon } from "@iconify/vue/dist/offline";

// 本地菜单图标，后端在路由的 icon 中返回对应的图标字符串并且前端在此处使用 addIcon 添加即可渲染菜单图标
// @iconify-icons/ep
import Lollipop from "@iconify-icons/ep/lollipop";
import HomeFilled from "@iconify-icons/ep/home-filled";
import Setting from "@iconify-icons/ep/setting";
import Operation from "@iconify-icons/ep/operation";
import Notebook from "@iconify-icons/ep/notebook";
import User from "@iconify-icons/ep/user";
import PriceTag from "@iconify-icons/ep/price-tag";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import Files from "@iconify-icons/ep/files";
import Stopwatch from "@iconify-icons/ep/stopwatch";
import Collection from "@iconify-icons/ep/collection";
import Medal from "@iconify-icons/ep/medal";
addIcon("ep:lollipop", Lollipop);
addIcon("ep:home-filled", HomeFilled);
addIcon("ep:setting", Setting);
addIcon("ep:operation", Operation);
addIcon("ep:notebook", Notebook);
addIcon("ep:user", User);
addIcon("ep:price-tag", PriceTag);
addIcon("ep:office-building", OfficeBuilding);
addIcon("ep:files", Files);
addIcon("ep:stopwatch", Stopwatch);
addIcon("ep:collection", Collection);
addIcon("ep:medal", Medal);
// @iconify-icons/ri
import Search from "@iconify-icons/ri/search-line";
import InformationLine from "@iconify-icons/ri/information-line";
import AdminLine from "@iconify-icons/ri/admin-line";
import Inbox2Line from "@iconify-icons/ri/inbox-2-line";
import StackLine from "@iconify-icons/ri/stack-line";
import AccountBoxLine from "@iconify-icons/ri/account-box-line";
import MailLockLine from "@iconify-icons/ri/mail-lock-line";
import HardDrive2Line from "@iconify-icons/ri/hard-drive-2-line";
addIcon("ri:search-line", Search);
addIcon("ri:information-line", InformationLine);
addIcon("ri:admin-line", AdminLine);
addIcon("ri:inbox-2-line", Inbox2Line);
addIcon("ri:stack-line", StackLine);
addIcon("ri:account-box-line", AccountBoxLine);
addIcon("ri:mail-lock-line", MailLockLine);
addIcon("ri:hard-drive-2-line", HardDrive2Line);

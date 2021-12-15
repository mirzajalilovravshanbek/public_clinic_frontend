import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Typography from "@/pages/Typography.vue";
import Notifications from "@/pages/Notifications.vue";

import Login from "@/pages/Login.vue";
import LoginUser from "@/pages/LoginUser.vue";

import CheckPrint from "@/pages/Patient/CheckPrint.vue";
import PatientIndex from "@/pages/Patient/Index.vue";
import PatientCreate from "@/pages/Patient/Create.vue";
import PatientUpdate from "@/pages/Patient/Update.vue";

import EmployeesIndex from "@/pages/Employees/Index.vue";
import EmployeesCreate from "@/pages/Employees/Create.vue";
import EmployeesUpdate from "@/pages/Employees/Update.vue";

import ReportsIndex from "@/pages/Reports/Index.vue";
import ReportsKassa from "@/pages/Reports/Kassa.vue";
import ReportsPatientXisobot from "@/pages/Reports/PatientXisobot.vue";
import ReportsPatient from "@/pages/Reports/Patient.vue";
import ReportsEmployeesXisobot from "@/pages/Reports/EmployeesXisobot.vue";
import ReportsEmployees from "@/pages/Reports/Employees.vue";

import RoomIndex from "@/pages/Room/Index.vue";
import DoctorRoomIndex from "@/pages/Room/DoctorRoom/Index.vue";
import DoctorRoomCreate from "@/pages/Room/DoctorRoom/Create.vue";
import DoctorRoomUpdate from "@/pages/Room/DoctorRoom/Update.vue";

import PatientRoomIndex from "@/pages/Room/PatientRoom/Index.vue";
import PatientRoomCreate from "@/pages/Room/PatientRoom/Create.vue";
import PatientRoomUpdate from "@/pages/Room/PatientRoom/Update.vue";

import InspectionsIndex from "@/pages/Inspections/Index.vue";
import InspectionsCreate from "@/pages/Inspections/Create.vue";
import InspectionsUpdate from "@/pages/Inspections/Update.vue";
const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Навбатлар Рўйҳати",
        component: Dashboard
      },
      {
        path: "/patient/index",
        name: "Регистрация",
        component: PatientIndex
      },
      {
        path: "/employees/index",
        name: "Ҳодимлар",
        component: EmployeesIndex
      },
      {
        path: "/employees/create",
        name: "Ҳодим Қўшиш",
        component: EmployeesCreate
      },
      {
        path: "/employees/update/:id",
        name: "Ҳодимни таҳрирлаш",
        component: EmployeesUpdate
      },
      {
        path: "/reports/index",
        name: "Ҳисоботлар",
        component: ReportsIndex
      },
      {
        path: "/reports/kassa",
        name: "Касса Китоби",
        component: ReportsKassa
      },
      {
        path: "/reports/patientxisobot",
        name: "Бемор Ҳисоботи",
        component: ReportsPatientXisobot
      },
      {
        path: "/reports/patient/:id",
        name: "Бемор Сверкаси",
        component: ReportsPatient
      },
      {
        path: "/reports/employeesxisobot",
        name: "Ҳодим Ҳисоботи",
        component: ReportsEmployeesXisobot
      },
      {
        path: "/reports/employees/:id",
        name: "Ҳодим Сверкаси",
        component: ReportsEmployees
      },
      {
        path: "/room/index",
        name: "Хоналар",
        component: RoomIndex
      },
      {
        path: "/room/doctorroom/index",
        name: "Шифокор Хоналари",
        component: DoctorRoomIndex
      },
      {
        path: "/room/doctorroom/create",
        name: "Хона Қўшиш ",
        component: DoctorRoomCreate
      },
      {
        path: "/room/doctorroom/update/:id",
        name: "Хонани таҳрирлаш ",
        component: DoctorRoomUpdate
      },
      {
        path: "/room/patientroom/index",
        name: "Бемор Хоналари",
        component: PatientRoomIndex
      },
      {
        path: "/room/patientroom/create",
        name: "Хона Қўшиш",
        component: PatientRoomCreate
      },
      {
        path: "/room/patientroom/update/:id",
        name: "Хонани таҳрирлаш",
        component: PatientRoomUpdate
      },
      {
        path: "/inspections/index",
        name: "Текширувлар",
        component: InspectionsIndex
      },
      {
        path: "/inspections/create",
        name: "Текширув Қўшиш ",
        component: InspectionsCreate
      },
      {
        path: "/inspections/update/:id",
        name: "Текширувни таҳрирлаш ",
        component: InspectionsUpdate
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile
      },
      {
        path: "typography",
        name: "Typography",
        component: Typography
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/loginuser",
    name: "LoginUser",
    component: LoginUser
  },
  {
    path: "/patient/create",
    name: "Бемор Қўшиш",
    component: PatientCreate
  },
  {
    path: "/patient/update/:id",
    name: "Регистрация хужжатини таҳрирлаш",
    component: PatientUpdate
  },
  {
    path: "/patient/checkprint",
    name: "Чек",
    component: CheckPrint
  }
];

export default routes;

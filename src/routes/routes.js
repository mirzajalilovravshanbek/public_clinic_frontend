const routes = [
  {
    path: "/",
    component: () => import("@/pages/Layout/DashboardLayout.vue"),
    redirect: "/patient/index",
    children: [
      {
        path: "/patient/index",
        name: "Регистрация",
        component: () => import("@/pages/Patient/Index.vue")
      },
      {
        path: "/employees/index",
        name: "Ҳодимлар",
        component: () => import("@/pages/Employees/Index.vue")
      },
      {
        path: "/employees/create",
        name: "Ҳодим Қўшиш",
        component: () => import("@/pages/Employees/Create.vue")
      },
      {
        path: "/employees/update/:id",
        name: "Ҳодимни Таҳрирлаш",
        component: () => import("@/pages/Employees/Update.vue")
      },
      {
        path: "/doctorcategory/index",
        name: "Шифокор Бўлимлари",
        component: () => import("@/pages/DoctorCategory/Index.vue")
      },
      {
        path: "/doctorcategory/create",
        name: "Шифокор Бўлим Қўшиш",
        component: () => import("@/pages/DoctorCategory/Create.vue")
      },
      {
        path: "/doctorcategory/update/:id",
        name: "Шифокор Бўлимни Таҳрирлаш",
        component: () => import("@/pages/DoctorCategory/Update.vue")
      },
      {
        path: "/inspectioncategory/index",
        name: "Текширув Бўлимлари",
        component: () => import("@/pages/InspectionCategory/Index.vue")
      },
      {
        path: "/inspectioncategory/create",
        name: "Текширув Бўлими Қўшиш",
        component: () => import("@/pages/InspectionCategory/Create.vue")
      },
      {
        path: "/inspectioncategory/update/:id",
        name: "Текширув Бўлимни Таҳрирлаш",
        component: () => import("@/pages/InspectionCategory/Update.vue")
      },
      {
        path: "/inspectionfolder/index",
        name: "Текширув Папкалари",
        component: () => import("@/pages/InspectionFolder/Index.vue")
      },
      {
        path: "/inspectionfolder/create",
        name: "Текширув Папка Қўшиш",
        component: () => import("@/pages/InspectionFolder/Create.vue")
      },
      {
        path: "/inspectionfolder/update/:id",
        name: "Текширув Папкани Таҳрирлаш",
        component: () => import("@/pages/InspectionFolder/Update.vue")
      },
      {
        path: "/doctor/index",
        name: "Шифокорлар",
        component: () => import("@/pages/Doctor/Index.vue")
      },
      {
        path: "/doctor/create",
        name: "Шифокор Қўшиш",
        component: () => import("@/pages/Doctor/Create.vue")
      },
      {
        path: "/doctor/update/:id",
        name: "Шифокорни Таҳрирлаш",
        component: () => import("@/pages/Doctor/Update.vue")
      },
      {
        path: "/branch/index",
        name: "Филиаллар",
        component: () => import("@/pages/Branch/Index.vue")
      },
      {
        path: "/branch/create",
        name: "Филиал Қўшиш",
        component: () => import("@/pages/Branch/Create.vue")
      },
      {
        path: "/branch/update/:id",
        name: "Филиални Таҳрирлаш",
        component: () => import("@/pages/Branch/Update.vue")
      },
      {
        path: "/pill/index",
        name: "Дорилар",
        component: () => import("@/pages/Pill/Index.vue")
      },
      {
        path: "/pill/create",
        name: "Дори Қўшиш",
        component: () => import("@/pages/Pill/Create.vue")
      },
      {
        path: "/pill/update/:id",
        name: "Дорини Таҳрирлаш",
        component: () => import("@/pages/Pill/Update.vue")
      },
      {
        path: "/patientcrud/index",
        name: "Беморлар",
        component: () => import("@/pages/PatientCrud/Index.vue")
      },
      {
        path: "/patientcrud/create",
        name: "Бемор Қўшиш",
        component: () => import("@/pages/PatientCrud/Create.vue")
      },
      {
        path: "/patientcrud/update/:id",
        name: "Беморни Таҳрирлаш",
        component: () => import("@/pages/PatientCrud/Update.vue")
      },
      {
        path: "/reports/index",
        name: "Ҳисоботлар",
        component: () => import("@/pages/Reports/Index.vue")
      },
      {
        path: "/reports/kassa",
        name: "Касса Китоби",
        component: () => import("@/pages/Reports/Kassa.vue")
      },
      {
        path: "/reports/patientxisobot",
        name: "Бемор Ҳисоботи",
        component: () => import("@/pages/Reports/PatientXisobot.vue")
      },
      {
        path: "/reports/patient/:id",
        name: "Бемор Сверкаси",
        component: () => import("@/pages/Reports/Patient.vue")
      },
      {
        path: "/reports/employeesxisobot",
        name: "Ҳодим Ҳисоботи",
        component: () => import("@/pages/Reports/EmployeesXisobot.vue")
      },
      {
        path: "/reports/employees/:id",
        name: "Ҳодим Сверкаси",
        component: () => import("@/pages/Reports/Employees.vue")
      },
      {
        path: "/room/index",
        name: "Хоналар",
        component: () => import("@/pages/Room/Index.vue")
      },
      {
        path: "/room/doctorroom/index",
        name: "Шифокор Хоналари",
        component: () => import("@/pages/Room/DoctorRoom/Index.vue")
      },
      {
        path: "/room/doctorroom/create",
        name: "Хона Қўшиш ",
        component: () => import("@/pages/Room/DoctorRoom/Create.vue")
      },
      {
        path: "/room/doctorroom/update/:id",
        name: "Хонани Таҳрирлаш ",
        component: () => import("@/pages/Room/DoctorRoom/Update.vue")
      },
      {
        path: "/room/patientroom/index",
        name: "Бемор Хоналари",
        component: () => import("@/pages/Room/PatientRoom/Index.vue")
      },
      {
        path: "/room/patientroom/create",
        name: "Хона Қўшиш",
        component: () => import("@/pages/Room/PatientRoom/Create.vue")
      },
      {
        path: "/room/patientroom/update/:id",
        name: "Хонани Таҳрирлаш",
        component: () => import("@/pages/Room/PatientRoom/Update.vue")
      },
      {
        path: "/inspections/index",
        name: "Текширувлар",
        component: () => import("@/pages/Inspections/Index.vue")
      },
      {
        path: "/inspections/create",
        name: "Текширув Қўшиш ",
        component: () => import("@/pages/Inspections/Create.vue")
      },
      {
        path: "/inspections/update/:id",
        name: "Текширувни Таҳрирлаш ",
        component: () => import("@/pages/Inspections/Update.vue")
      },
      {
        path: "user",
        name: "User Profile",
        component: () => import("@/pages/UserProfile.vue")
      },
      {
        path: "typography",
        name: "Typography",
        component: () => import("@/pages/Typography.vue")
      },
      {
        path: "notifications",
        name: "Notifications",
        component: () => import("@/pages/Notifications.vue")
      }
    ]
  },
  {
    path: "/dashboard",
    name: "Навбатлар Рўйҳати",
    component: () => import("@/pages/Dashboard.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login.vue")
  },
  {
    path: "/loginuser",
    name: "LoginUser",
    component: () => import("@/pages/LoginUser.vue")
  },
  {
    path: "/patient/create",
    name: "Регистрация Ойнаси",
    component: () => import("@/pages/Patient/Create.vue")
  },
  {
    path: "/patient/update/:id",
    name: "Регистрация хужжатини Таҳрирлаш",
    component: () => import("@/pages/Patient/Update.vue")
  },
  {
    path: "/patient/checkprint",
    name: "Чек",
    component: () => import("@/pages/Patient/CheckPrint.vue")
  }
];

export default routes;

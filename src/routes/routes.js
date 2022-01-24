const routes = [
  {
    path: "/",
    component: () => import("@/pages/Layout/DashboardLayout.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Навбатлар Рўйҳати",
        component: () => import("@/pages/Dashboard.vue")
      },
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
        name: "Ҳодимни таҳрирлаш",
        component: () => import("@/pages/Employees/Update.vue")
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
        name: "Хонани таҳрирлаш ",
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
        name: "Хонани таҳрирлаш",
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
        name: "Текширувни таҳрирлаш ",
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
    name: "Бемор Қўшиш",
    component: () => import("@/pages/Patient/Create.vue")
  },
  {
    path: "/patient/update/:id",
    name: "Регистрация хужжатини таҳрирлаш",
    component: () => import("@/pages/Patient/Update.vue")
  },
  {
    path: "/patient/checkprint",
    name: "Чек",
    component: () => import("@/pages/Patient/CheckPrint.vue")
  }
];

export default routes;

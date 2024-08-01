const homepagevienuelaroutes = [
  {
    path: "/",
    name: 'homepage',
    component: () => import('../layouts/HomePageLayout.vue'),
    meta: {requiresAuth: true},
    children: [
      // Default Hompage:
      {
        path: "",
        name: "default_homepage",
        component: () => import('../pages/DefaultHomePage.vue'),
      },
      // Render board thuộc về 1 workspace:
      {
        path: '/workspace_board_view/:idWorkSpace',
        name: 'boardviewbyworkspace',
        component: () => import('../pages/workspaces/BoardViewUnderByWorkspace.vue'),
      },
      // Quản lý workspaces
      {
        path:"/workspaces/:idUser",
        name: 'workspaces',
        component: () => import("../pages/workspaces/BoardView.vue"),
      },
      {
        path: "/highlights/table",
        name: 'highlights_table',
        component: () => import("../pages/workspaces/highlights/HighlightTable.vue"),
      },
      {
        path: "/highlights/calendar",
        name: 'highlights_calendar',
        component: () => import("../pages/workspaces/highlights/HighlightCalendar.vue"),
      },
      // quản lý thông tin cá nhân
      {
        path: '/useraccount_information',
        name: 'useraccount',
        component: () => import("../pages/usersaccount/managepersonalinformation/PersonalInformation.vue"),
      },
      {
        path: '/useraccount_notification',
        name: 'managenotification',
        component: () => import("../pages/usersaccount/managenotification/NotificationSettings.vue"),
      },
      {
        path: '/member',
        name: 'member',
        component: () => import('../pages/members/ManageMembers.vue'),
        children: [
          {
            path: "",
            name: 'member_workspacemember',
            component: () => import('../pages/members/workspacemember/WorkSpaceMembers.vue')
          },
          {
            path: 'guestmember',
            name: 'member_guestmember',
            component: () => import('../pages/members/guest/GuestMembers.vue')
          },
          {
            path: 'joinrequest',
            name: 'member_joinrequest',
            component: () => import('../pages/members/joinrequest/JoinRequest.vue')
          }
        ]
      }
  ]
  },
];
export default homepagevienuelaroutes;
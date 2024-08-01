const boardvienuelaroutes = [
  {
    path: '/board/:id',
    name: 'board',
    component: () => import('../layouts/BoardLayout.vue'),
    meta: { requiresAuth: true },
  },
];
export default boardvienuelaroutes;
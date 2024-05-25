export const PERMISSIONS = {
  ADMIN: 'ADMIN.GRANTED',
  BASIC: 'BASIC.PUBLIC',
  DASHBOARD: 'DASHBOARD',
  MANAGE_PRODUCT: {
    PRODUCT: {
      CREATE: 'MANAGE_PRODUCT.PRODUCT.CREATE',

      UPDATE: 'MANAGE_PRODUCT.PRODUCT.UPDATE',
      DELETE: 'MANAGE_PRODUCT.PRODUCT.DELETE'
    },
    PRODUCT_TYPE: {
      VIEW: 'MANAGE_PRODUCT.PRODUCT_TYPE.VIEW',
      CREATE: 'MANAGE_PRODUCT.PRODUCT_TYPE.CREATE',
      UPDATE: 'MANAGE_PRODUCT.PRODUCT_TYPE.UPDATE',
      DELETE: 'MANAGE_PRODUCT.PRODUCT_TYPE.DELETE'
    }
  },
  SYSTEM: {
    USER: {
      VIEW: 'SYSTEM.USER.VIEW',
      CREATE: 'SYSTEM.USER.CREATE',
      UPDATE: 'SYSTEM.USER.UPDATE',
      DELETE: 'SYSTEM.USER.DELETE'
    },
    ROLE: {
      VIEW: 'SYSTEM.ROLE.VIEW',
      CREATE: 'SYSTEM.ROLE.CREATE',
      UPDATE: 'SYSTEM.ROLE.UPDATE',
      DELETE: 'SYSTEM.ROLE.DELETE'
    }
  },
  MANAGE_ORDER: {
    REVIEW: {
      UPDATE: 'MANAGE_ORDER.REVIEW.UPDATE',
      DELETE: 'MANAGE_ORDER.REVIEW.DELETE'
    },
    ORDER: {
      VIEW: 'MANAGE_ORDER.ORDER.VIEW',
      CREATE: 'MANAGE_ORDER.ORDER.CREATE',
      UPDATE: 'MANAGE_ORDER.ORDER.UPDATE',
      DELETE: 'MANAGE_ORDER.ORDER.DELETE'
    }
  },
  SETTING: {
    PAYMENT_TYPE: {
      CREATE: 'SETTING.PAYMENT_TYPE.CREATE',
      UPDATE: 'SETTING.PAYMENT_TYPE.UPDATE',
      DELETE: 'SETTING.PAYMENT_TYPE.DELETE'
    },
    DELIVERY_TYPE: {
      CREATE: 'SETTING.DELIVERY_TYPE.CREATE',
      UPDATE: 'SETTING.DELIVERY_TYPE.UPDATE',
      DELETE: 'SETTING.DELIVERY_TYPE.DELETE'
    },
    CITY: {
      CREATE: 'CITY.CREATE',
      UPDATE: 'CITY.UPDATE',
      DELETE: 'CITY.DELETE'
    }
  }
}
export const LIST_DATA_PERMISSIONS: any = [
  {
    id: 1,
    name: 'Manage_product',
    isParent: true
  },
  {
    id: 2,
    name: 'Product',
    isParent: false,
    create: PERMISSIONS.MANAGE_PRODUCT.PRODUCT.CREATE,
    update: PERMISSIONS.MANAGE_PRODUCT.PRODUCT.UPDATE,
    delete: PERMISSIONS.MANAGE_PRODUCT.PRODUCT.DELETE,
    isHideView: true
  },
  {
    id: 3,
    name: 'Product_type',
    isParent: false,
    create: PERMISSIONS.MANAGE_PRODUCT.PRODUCT_TYPE.CREATE,
    update: PERMISSIONS.MANAGE_PRODUCT.PRODUCT_TYPE.UPDATE,
    delete: PERMISSIONS.MANAGE_PRODUCT.PRODUCT_TYPE.DELETE,
    view: PERMISSIONS.MANAGE_PRODUCT.PRODUCT_TYPE.VIEW
  },
  {
    id: 4,
    name: 'System',
    isParent: true
  },
  {
    id: 5,
    name: 'User',
    isParent: false,
    create: PERMISSIONS.SYSTEM.USER.CREATE,
    update: PERMISSIONS.SYSTEM.USER.UPDATE,
    delete: PERMISSIONS.SYSTEM.USER.DELETE,
    view: PERMISSIONS.SYSTEM.USER.VIEW
  },
  {
    id: 6,
    name: 'Role',
    isParent: false,
    create: PERMISSIONS.SYSTEM.ROLE.CREATE,
    update: PERMISSIONS.SYSTEM.ROLE.UPDATE,
    delete: PERMISSIONS.SYSTEM.ROLE.DELETE,
    view: PERMISSIONS.SYSTEM.ROLE.VIEW
  },
  {
    id: 7,
    name: 'Manage_order',
    isParent: true
  },
  {
    id: 8,
    name: 'Review',
    isParent: false,
    update: PERMISSIONS.MANAGE_ORDER.REVIEW.UPDATE,
    delete: PERMISSIONS.MANAGE_ORDER.REVIEW.DELETE,
    isHideView: true,
    isHideCreate: true
  },
  {
    id: 9,
    name: 'Order',
    isParent: false,
    create: PERMISSIONS.MANAGE_ORDER.ORDER.CREATE,
    update: PERMISSIONS.MANAGE_ORDER.ORDER.UPDATE,
    delete: PERMISSIONS.MANAGE_ORDER.ORDER.DELETE,
    view: PERMISSIONS.MANAGE_ORDER.ORDER.VIEW
  },
  {
    id: 10,
    name: 'Setting',
    isParent: true
  },
  {
    id: 11,
    name: 'City',
    isParent: false,
    create: PERMISSIONS.SETTING.CITY.CREATE,
    update: PERMISSIONS.SETTING.CITY.UPDATE,
    delete: PERMISSIONS.SETTING.CITY.DELETE,
    isHideView: true
  },
  {
    id: 12,
    name: 'Delivery_type',
    isParent: false,
    create: PERMISSIONS.SETTING.DELIVERY_TYPE.CREATE,
    update: PERMISSIONS.SETTING.DELIVERY_TYPE.UPDATE,
    delete: PERMISSIONS.SETTING.DELIVERY_TYPE.DELETE,
    isHideView: true
  },
  {
    id: 13,
    name: 'Payment_type',
    isParent: false,
    create: PERMISSIONS.SETTING.PAYMENT_TYPE.CREATE,
    update: PERMISSIONS.SETTING.PAYMENT_TYPE.UPDATE,
    delete: PERMISSIONS.SETTING.PAYMENT_TYPE.DELETE,
    isHideView: true
  }
]

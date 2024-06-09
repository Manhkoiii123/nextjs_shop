import { useTranslation } from 'react-i18next'

export const OBJECT_STATUS_USER = () => {
  const { t } = useTranslation()

  return {
    '0': {
      label: t('Block'),
      value: '0'
    },
    '1': {
      label: t('Active'),
      value: '1'
    }
  }
}

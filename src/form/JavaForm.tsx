import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiContext } from './Form'
import ResourceSelect from './ResourceSelect'

export default function JavaForm() {
  const api = useContext(ApiContext)
  const { t } = useTranslation()

  return (
    <>
      <ResourceSelect
        onChange={() => {}}
        options={api?.je_modules.resource!}
        label={t('form.resource.label')}
        helper={t('form.resource.helper')}
      />
    </>
  )
}

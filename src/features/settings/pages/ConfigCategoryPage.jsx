import { Navigate, useParams } from 'react-router-dom'
import { ConfigCategoryManager } from '@/features/settings/components/ConfigCategoryManager'
import { getConfigCategoryByPath } from '@/features/settings/constants/configCategories'
import { ROUTES } from '@/routes/paths'

export function ConfigCategoryPage() {
  const { categoryPath } = useParams()
  const category = getConfigCategoryByPath(categoryPath)

  if (!category || category.storage !== 'preferences') {
    return <Navigate to={`${ROUTES.SETTINGS}/instruments`} replace />
  }

  return <ConfigCategoryManager category={category} />
}

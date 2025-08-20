
import { AddItemForm } from '../../../forms/AddItemForm'
import { MAIN_VIEW_STYLES } from '../../../../constants'

/**
 * Add Item Section Component
 * Single Responsibility: Wrap AddItemForm with proper styling
 */
export function AddItemSection() {
  return (
    <div className={MAIN_VIEW_STYLES.CARD}>
      <AddItemForm/>
    </div>
  )
}

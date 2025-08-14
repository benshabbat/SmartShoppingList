import React from 'react'
import { DataExport } from '../../DataExport'
import { MAIN_VIEW_STYLES } from '../../../constants'

/**
 * Data Export Section Component
 * Single Responsibility: Wrap DataExport with proper styling
 */
export function DataExportSection() {
  return (
    <div className={MAIN_VIEW_STYLES.CARD}>
      <DataExport />
    </div>
  )
}

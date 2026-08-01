'use client'

import { useEffect, useState } from 'react'

export type ViewMode = 'table' | 'card'

const CARD_BREAKPOINT = 1024

export const useViewMode = () => {
	const [viewMode, setViewModeState] = useState<ViewMode>('table')
	const [isManual, setIsManual] = useState(false)

	useEffect(() => {
		if (isManual) {
			return
		}

		const mql = window.matchMedia(`(max-width: ${CARD_BREAKPOINT - 1}px)`)
		const applyDefault = () => {
			setViewModeState(mql.matches ? 'card' : 'table')
		}

		applyDefault()
		mql.addEventListener('change', applyDefault)
		return () => mql.removeEventListener('change', applyDefault)
	}, [isManual])

	const setViewMode = (mode: ViewMode) => {
		setIsManual(true)
		setViewModeState(mode)
	}

	return [viewMode, setViewMode] as const
}

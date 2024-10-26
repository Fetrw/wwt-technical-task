import React, { useEffect, useState } from 'react'

import { Box, Button, Spinner, Text, useDisclosure } from '@chakra-ui/react'
import { t } from 'i18next'

import { FilterModal } from '@components/FilterModal/FilterModal'

import { SearchRequestOptions } from '../../api/types/SearchRequest/SearchRequestFilter'

export const App: React.FC = () => {
	const [filters, setFilters] = useState<SearchRequestOptions[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [selectedFilters, setSelectedFilters] = useState<{
		[key: string]: string[]
	}>({})
	const { isOpen, onOpen, onClose } = useDisclosure()

	useEffect(() => {
		const fetchFilters = async () => {
			try {
				const response = await fetch('/filterData.json')
				if (!response.ok) {
					throw new Error('Failed to fetch filter data')
				}
				const data = await response.json()
				setFilters(data.filterItems || [])

				const initialFilters: { [key: string]: string[] } = {}
				data.filterItems.forEach((filter: SearchRequestOptions) => {
					initialFilters[filter.id] = []
				})
				setSelectedFilters(initialFilters)
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message)
				} else {
					setError('An unknown error occurred')
				}
			} finally {
				setLoading(false)
			}
		}

		fetchFilters()
	}, [])

	const handleApplyFilters = (filters: { [key: string]: string[] }) => {
		console.log('Applied Filters:', filters)
		setSelectedFilters(filters)
		onClose()
	}

	if (loading) {
		return (
			<Box
				textAlign="center"
				mt={20}
			>
				<Spinner />
				<Text mt={4}>{t('loading')}</Text>
			</Box>
		)
	}

	if (error) {
		return (
			<Box
				textAlign="center"
				mt={20}
			>
				<Text color="red.500">{error}</Text>
			</Box>
		)
	}

	return (
		<Box
			maxW="90rem"
			mx="auto"
			minH="100vh"
		>
			<Button onClick={onOpen}>{t('openFilters')}</Button>
			<FilterModal
				isOpen={isOpen}
				onClose={onClose}
				filters={filters}
				onSave={handleApplyFilters}
				savedFilters={selectedFilters}
			/>
			<Box mt={5}>
				<Text fontWeight="bold">{t('selectedFilters')}</Text>
				<pre>{JSON.stringify(selectedFilters, null, 2)}</pre>
			</Box>
		</Box>
	)
}

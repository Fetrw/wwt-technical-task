import React, { useEffect, useState } from 'react'

import {
	Box,
	Button,
	Checkbox,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	SimpleGrid,
	Text
} from '@chakra-ui/react'
import { t } from 'i18next'

import { SearchRequestOptions } from '../../api/types/SearchRequest/SearchRequestFilter'

interface FilterModalProps {
	isOpen: boolean
	onClose: () => void
	filters: SearchRequestOptions[]
	onSave: (filters: { [key: string]: string[] }) => void
	savedFilters: { [key: string]: string[] }
}

export const FilterModal: React.FC<FilterModalProps> = ({
	isOpen,
	onClose,
	filters,
	onSave,
	savedFilters
}) => {
	const [selectedFilters, setSelectedFilters] = useState<{
		[key: string]: string[]
	}>({})

	useEffect(() => {
		setSelectedFilters(savedFilters)
	}, [isOpen, savedFilters])

	const handleFilterChange = (filterId: string, optionId: string) => {
		setSelectedFilters(prevFilters => {
			const currentOptions = prevFilters[filterId] || []
			if (currentOptions.includes(optionId)) {
				return {
					...prevFilters,
					[filterId]: currentOptions.filter(id => id !== optionId)
				}
			} else {
				return { ...prevFilters, [filterId]: [...currentOptions, optionId] }
			}
		})
	}

	const handleSave = () => {
		onSave(selectedFilters)
		onClose()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t('filters')}</ModalHeader>
				<ModalBody>
					{filters.map(filter => (
						<Box
							key={filter.id}
							mb={4}
						>
							<Text fontWeight="bold">{filter.name}</Text>
							<SimpleGrid
								columns={[2, null, 3]}
								spacing={4}
							>
								{filter.options.map(option => (
									<Checkbox
										key={option.id}
										isChecked={selectedFilters[filter.id]?.includes(option.id)}
										onChange={() => handleFilterChange(filter.id, option.id)}
									>
										{option.name}
									</Checkbox>
								))}
							</SimpleGrid>
						</Box>
					))}
				</ModalBody>
				<ModalFooter>
					<Button
						variant="outline"
						onClick={onClose}
					>
						{t('cancel')}
					</Button>
					<Button
						bg="orange.600"
						color="white"
						_hover={{ bg: 'orange.700' }}
						onClick={handleSave}
						ml={3}
					>
						{t('applyFilters')}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default FilterModal

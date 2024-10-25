import { FilterType } from '../Filter'

export interface SearchRequestFilterBase {
	id: string
	name: string
	type: FilterType
}

export interface FilterOption {
	id: string
	name: string
}

export interface SearchRequestOptions extends SearchRequestFilterBase {
	type: FilterType.OPTION
	options: FilterOption[]
}

export type SearchRequestFilter = (
	| SearchRequestOptions
	| SearchRequestFilterBase
)[]

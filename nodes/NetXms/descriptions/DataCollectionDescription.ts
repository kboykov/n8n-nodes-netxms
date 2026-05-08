import type { INodeProperties } from 'n8n-workflow';

export const dataCollectionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dataCollection'],
			},
		},
		options: [
			{
				name: 'Get Current Values',
				value: 'getCurrentValues',
				description: 'Get current values for all DCIs of an object',
				action: 'Get current DCI values',
			},
			{
				name: 'Get History',
				value: 'getHistory',
				description: 'Get historical data for a specific DCI',
				action: 'Get DCI history',
			},
		],
		default: 'getCurrentValues',
	},
];

export const dataCollectionFields: INodeProperties[] = [
	// -------------------------------------------
	// Shared: Object ID
	// -------------------------------------------
	{
		displayName: 'Object ID',
		name: 'objectId',
		type: 'number',
		default: 0,
		required: true,
		description: 'The numeric ID of the data collection target object',
		displayOptions: {
			show: {
				resource: ['dataCollection'],
				operation: ['getCurrentValues', 'getHistory'],
			},
		},
	},

	// -------------------------------------------
	// Get History: DCI ID
	// -------------------------------------------
	{
		displayName: 'DCI ID',
		name: 'dciId',
		type: 'number',
		default: 0,
		required: true,
		description: 'The numeric ID of the Data Collection Item',
		displayOptions: {
			show: {
				resource: ['dataCollection'],
				operation: ['getHistory'],
			},
		},
	},

	// -------------------------------------------
	// Get History: optional filters
	// -------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['dataCollection'],
				operation: ['getHistory'],
			},
		},
		options: [
			{
				displayName: 'Aggregation Function',
				name: 'function',
				type: 'options',
				default: 'avg',
				options: [
					{ name: 'Average', value: 'avg' },
					{ name: 'Maximum', value: 'max' },
					{ name: 'Minimum', value: 'min' },
					{ name: 'Min & Max (Band)', value: 'minmax' },
				],
				description:
					'Aggregation function for hourly/daily tier reads. Ignored for raw data.',
			},
			{
				displayName: 'Max Data Points',
				name: 'maxDataPoints',
				type: 'number',
				default: 0,
				description:
					'When reading raw data, bucket into this many points on-the-fly. 0 = disabled.',
			},
			{
				displayName: 'Max Rows',
				name: 'maxRows',
				type: 'number',
				default: 0,
				description: 'Maximum number of data points to return. 0 = server default.',
			},
			{
				displayName: 'Storage Tier',
				name: 'tier',
				type: 'options',
				default: 'auto',
				options: [
					{ name: 'Auto (Server Chooses)', value: 'auto' },
					{ name: 'Daily Aggregates', value: 'daily' },
					{ name: 'Hourly Aggregates', value: 'hourly' },
					{ name: 'Raw Samples', value: 'raw' },
				],
				description: 'Storage tier to read from',
			},
			{
				displayName: 'Time From (Unix Timestamp)',
				name: 'timeFrom',
				type: 'number',
				default: 0,
				description: 'Start of the time range as a Unix timestamp. 0 = no lower bound.',
			},
			{
				displayName: 'Time To (Unix Timestamp)',
				name: 'timeTo',
				type: 'number',
				default: 0,
				description: 'End of the time range as a Unix timestamp. 0 = now.',
			},
		],
	},
];

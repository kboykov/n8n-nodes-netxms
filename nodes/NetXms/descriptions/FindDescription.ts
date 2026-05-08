import type { INodeProperties } from 'n8n-workflow';

export const findOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['find'],
			},
		},
		options: [
			{
				name: 'Find MAC Address',
				value: 'findMacAddress',
				description: 'Locate a MAC address (or partial MAC) in the network topology',
				action: 'Find a MAC address',
			},
			{
				name: 'Get Connection History',
				value: 'getConnectionHistory',
				description: 'Query the connection history for MAC address events',
				action: 'Get connection history',
			},
		],
		default: 'findMacAddress',
	},
];

export const findFields: INodeProperties[] = [
	// -------------------------------------------
	// Find MAC Address: required
	// -------------------------------------------
	{
		displayName: 'MAC Address',
		name: 'macAddress',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 00:1A:2B:3C:4D:5E',
		description: 'Full or partial MAC address to search for',
		displayOptions: {
			show: {
				resource: ['find'],
				operation: ['findMacAddress'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['find'],
				operation: ['findMacAddress'],
			},
		},
		options: [
			{
				displayName: 'Include Object Details',
				name: 'includeObjects',
				type: 'boolean',
				default: false,
				description: 'Whether to include full object information in the response',
			},
			{
				displayName: 'Result Limit',
				name: 'searchLimit',
				type: 'number',
				default: 100,
				description: 'Maximum number of results to return (default 100)',
			},
		],
	},

	// -------------------------------------------
	// Get Connection History: all optional filters
	// -------------------------------------------
	{
		displayName: 'Filters',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['find'],
				operation: ['getConnectionHistory'],
			},
		},
		options: [
			{
				displayName: 'From (Unix Timestamp)',
				name: 'from',
				type: 'number',
				default: 0,
				description: 'Start of the time range as a Unix timestamp',
			},
			{
				displayName: 'Interface ID',
				name: 'interfaceId',
				type: 'number',
				default: 0,
				description: 'Filter by interface ID',
			},
			{
				displayName: 'MAC Address',
				name: 'macAddress',
				type: 'string',
				default: '',
				description: 'Filter by MAC address',
			},
			{
				displayName: 'Node ID',
				name: 'nodeId',
				type: 'number',
				default: 0,
				description: 'Filter records matching this node ID (switch or connected node)',
			},
			{
				displayName: 'Result Limit',
				name: 'limit',
				type: 'number',
				default: 1000,
				description: 'Maximum number of records to return (max 10000)',
			},
			{
				displayName: 'Switch ID',
				name: 'switchId',
				type: 'number',
				default: 0,
				description: 'Filter by switch node ID',
			},
			{
				displayName: 'To (Unix Timestamp)',
				name: 'to',
				type: 'number',
				default: 0,
				description: 'End of the time range as a Unix timestamp',
			},
		],
	},
];

import type { INodeProperties } from 'n8n-workflow';

export const alarmOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['alarm'],
			},
		},
		options: [
			{
				name: 'Acknowledge',
				value: 'acknowledge',
				description: 'Acknowledge an alarm',
				action: 'Acknowledge an alarm',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific alarm',
				action: 'Get an alarm',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve a list of alarms',
				action: 'Get many alarms',
			},
			{
				name: 'Resolve',
				value: 'resolve',
				description: 'Resolve an alarm',
				action: 'Resolve an alarm',
			},
			{
				name: 'Terminate',
				value: 'terminate',
				description: 'Terminate an alarm',
				action: 'Terminate an alarm',
			},
		],
		default: 'getMany',
	},
];

export const alarmFields: INodeProperties[] = [
	// -------------------------------------------
	// Shared: Alarm ID
	// -------------------------------------------
	{
		displayName: 'Alarm ID',
		name: 'alarmId',
		type: 'number',
		default: 0,
		required: true,
		description: 'The numeric ID of the alarm',
		displayOptions: {
			show: {
				resource: ['alarm'],
				operation: ['get', 'acknowledge', 'resolve', 'terminate'],
			},
		},
	},

	// -------------------------------------------
	// Get Many: optional filters
	// -------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['alarm'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Include Object Details',
				name: 'includeObjectDetails',
				type: 'boolean',
				default: false,
				description: 'Whether to include full source object details in the response',
			},
			{
				displayName: 'Root Object ID',
				name: 'rootObject',
				type: 'number',
				default: 0,
				description:
					'ID of root object for alarm retrieval. Use 0 to retrieve all alarms.',
			},
		],
	},
];

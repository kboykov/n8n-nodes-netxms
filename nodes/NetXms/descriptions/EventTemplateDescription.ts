import type { INodeProperties } from 'n8n-workflow';

export const eventTemplateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['eventTemplate'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new event template',
				action: 'Create an event template',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a user-defined event template (event code ≥ 100000)',
				action: 'Delete an event template',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific event template by its event code',
				action: 'Get an event template',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve all event templates defined in the system',
				action: 'Get many event templates',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing event template',
				action: 'Update an event template',
			},
		],
		default: 'getMany',
	},
];

export const eventTemplateFields: INodeProperties[] = [
	// -------------------------------------------
	// Shared: Event Code
	// -------------------------------------------
	{
		displayName: 'Event Code',
		name: 'eventCode',
		type: 'number',
		default: 0,
		required: true,
		description: 'The numeric event code of the template',
		displayOptions: {
			show: {
				resource: ['eventTemplate'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// -------------------------------------------
	// Create: required name
	// -------------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. MY_CUSTOM_EVENT',
		description: 'Unique name for the event template (uppercase with underscores recommended)',
		displayOptions: {
			show: {
				resource: ['eventTemplate'],
				operation: ['create'],
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
				resource: ['eventTemplate'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Human-readable description of the event template',
			},
			{
				displayName: 'Flags',
				name: 'flags',
				type: 'number',
				default: 1,
				description: 'Event flags bitmask (1 = write to log)',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				placeholder: 'e.g. Event on %1',
				description: 'Message template; use %1, %2, … as parameter placeholders',
			},
			{
				displayName: 'Severity',
				name: 'severity',
				type: 'options',
				default: 0,
				options: [
					{ name: 'Critical', value: 4 },
					{ name: 'Major', value: 3 },
					{ name: 'Minor', value: 2 },
					{ name: 'Normal', value: 0 },
					{ name: 'Warning', value: 1 },
				],
				description: 'Default severity level for events generated from this template',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				placeholder: 'e.g. network,critical',
				description: 'Comma-separated list of tags to attach to the event template',
			},
		],
	},

	// -------------------------------------------
	// Update: all optional
	// -------------------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['eventTemplate'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Human-readable description of the event template',
			},
			{
				displayName: 'Flags',
				name: 'flags',
				type: 'number',
				default: 1,
				description: 'Event flags bitmask',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				description: 'Message template',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the event template',
			},
			{
				displayName: 'Severity',
				name: 'severity',
				type: 'options',
				default: 0,
				options: [
					{ name: 'Critical', value: 4 },
					{ name: 'Major', value: 3 },
					{ name: 'Minor', value: 2 },
					{ name: 'Normal', value: 0 },
					{ name: 'Warning', value: 1 },
				],
				description: 'Default severity level',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
		],
	},
];

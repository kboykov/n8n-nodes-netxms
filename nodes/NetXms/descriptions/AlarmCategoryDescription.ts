import type { INodeProperties } from 'n8n-workflow';

export const alarmCategoryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['alarmCategory'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new alarm category',
				action: 'Create an alarm category',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an alarm category',
				action: 'Delete an alarm category',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific alarm category',
				action: 'Get an alarm category',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve all configured alarm categories',
				action: 'Get many alarm categories',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing alarm category',
				action: 'Update an alarm category',
			},
		],
		default: 'getMany',
	},
];

export const alarmCategoryFields: INodeProperties[] = [
	// -------------------------------------------
	// Shared: Category ID
	// -------------------------------------------
	{
		displayName: 'Category ID',
		name: 'categoryId',
		type: 'number',
		default: 0,
		required: true,
		description: 'The numeric ID of the alarm category',
		displayOptions: {
			show: {
				resource: ['alarmCategory'],
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
		description: 'Display name of the alarm category',
		displayOptions: {
			show: {
				resource: ['alarmCategory'],
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
				resource: ['alarmCategory'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Optional description of the alarm category',
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
				resource: ['alarmCategory'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the alarm category',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New display name for the alarm category',
			},
		],
	},
];

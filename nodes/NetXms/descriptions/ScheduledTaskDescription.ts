import type { INodeProperties } from 'n8n-workflow';

export const scheduledTaskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['scheduledTask'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new scheduled task',
				action: 'Create a scheduled task',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a scheduled task',
				action: 'Delete a scheduled task',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a specific scheduled task',
				action: 'Get a scheduled task',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve a list of all scheduled tasks',
				action: 'Get many scheduled tasks',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing scheduled task',
				action: 'Update a scheduled task',
			},
		],
		default: 'getMany',
	},
];

export const scheduledTaskFields: INodeProperties[] = [
	// -------------------------------------------
	// Shared: Task ID
	// -------------------------------------------
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'number',
		default: 0,
		required: true,
		description: 'The numeric ID of the scheduled task',
		displayOptions: {
			show: {
				resource: ['scheduledTask'],
				operation: ['get', 'update', 'delete'],
			},
		},
	},

	// -------------------------------------------
	// Create: task handler (required)
	// -------------------------------------------
	{
		displayName: 'Task Handler',
		name: 'taskHandler',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. Execute.Script',
		description: 'Name of the registered task handler to invoke',
		displayOptions: {
			show: {
				resource: ['scheduledTask'],
				operation: ['create'],
			},
		},
	},

	// -------------------------------------------
	// Create: schedule type
	// -------------------------------------------
	{
		displayName: 'Schedule Type',
		name: 'scheduleType',
		type: 'options',
		default: 'cron',
		options: [
			{
				name: 'Recurring (Cron)',
				value: 'cron',
				description: 'Task runs on a repeating cron schedule',
			},
			{
				name: 'One-Time',
				value: 'oneTime',
				description: 'Task runs once at a specific time',
			},
		],
		displayOptions: {
			show: {
				resource: ['scheduledTask'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Cron Schedule',
		name: 'schedule',
		type: 'string',
		default: '0 * * * *',
		placeholder: '0 * * * *',
		description: 'Cron expression for when the task should run',
		displayOptions: {
			show: {
				resource: ['scheduledTask'],
				operation: ['create'],
				scheduleType: ['cron'],
			},
		},
	},
	{
		displayName: 'Execution Time (Unix Timestamp)',
		name: 'executionTime',
		type: 'number',
		default: 0,
		description: 'Unix timestamp of the one-time execution time',
		displayOptions: {
			show: {
				resource: ['scheduledTask'],
				operation: ['create'],
				scheduleType: ['oneTime'],
			},
		},
	},

	// -------------------------------------------
	// Create: additional fields
	// -------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['scheduledTask'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Comments',
				name: 'comments',
				type: 'string',
				default: '',
				description: 'Optional comments about the task',
			},
			{
				displayName: 'Object ID',
				name: 'objectId',
				type: 'number',
				default: 0,
				description: 'Object ID to associate with the task (0 for no object)',
			},
			{
				displayName: 'Parameters',
				name: 'parameters',
				type: 'string',
				default: '',
				description: 'Task parameters as a string (format depends on handler)',
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
				resource: ['scheduledTask'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Comments',
				name: 'comments',
				type: 'string',
				default: '',
				description: 'Comments about the task',
			},
			{
				displayName: 'Cron Schedule',
				name: 'schedule',
				type: 'string',
				default: '',
				placeholder: '0 * * * *',
				description: 'Cron expression. Provide this OR Execution Time, not both.',
			},
			{
				displayName: 'Execution Time (Unix Timestamp)',
				name: 'executionTime',
				type: 'number',
				default: 0,
				description: 'Unix timestamp for one-time execution. Provide this OR Cron Schedule, not both.',
			},
			{
				displayName: 'Object ID',
				name: 'objectId',
				type: 'number',
				default: 0,
				description: 'Object ID to associate with the task',
			},
			{
				displayName: 'Parameters',
				name: 'parameters',
				type: 'string',
				default: '',
				description: 'Task parameters string',
			},
			{
				displayName: 'Task Handler',
				name: 'taskHandler',
				type: 'string',
				default: '',
				description: 'Name of the registered task handler',
			},
		],
	},
];

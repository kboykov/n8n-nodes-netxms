import type { INodeProperties } from 'n8n-workflow';

export const objectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
			},
		},
		options: [
			{
				name: 'Execute Script',
				value: 'executeScript',
				description: 'Execute an NXSL script in the context of an object',
				action: 'Execute a script on an object',
			},
			{
				name: 'Expand Text',
				value: 'expandText',
				description: 'Expand NetXMS macros in a text string within the context of an object',
				action: 'Expand text macros on an object',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get full details of a specific object',
				action: 'Get an object',
			},
			{
				name: 'Get Children',
				value: 'getChildren',
				description: 'Get full details of all direct child objects',
				action: 'Get children of an object',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Retrieve a list of objects',
				action: 'Get many objects',
			},
			{
				name: 'Get Status Explanation',
				value: 'getStatusExplanation',
				description: 'Get a detailed breakdown of how the object status was calculated',
				action: 'Get status explanation of an object',
			},
			{
				name: 'Get Sub-Tree',
				value: 'getSubTree',
				description: 'Retrieve the sub-tree of objects under a parent',
				action: 'Get sub-tree of an object',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search for objects matching specific criteria',
				action: 'Search objects',
			},
			{
				name: 'Set Maintenance',
				value: 'setMaintenance',
				description: 'Enter or leave maintenance mode',
				action: 'Set maintenance mode on an object',
			},
			{
				name: 'Set Managed',
				value: 'setManaged',
				description: 'Manage or unmanage an object',
				action: 'Set managed state of an object',
			},
		],
		default: 'getMany',
	},
];

export const objectFields: INodeProperties[] = [
	// -------------------------------------------
	// Shared: Object ID
	// -------------------------------------------
	{
		displayName: 'Object ID',
		name: 'objectId',
		type: 'number',
		default: 0,
		required: true,
		description: 'The numeric ID of the object',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: [
					'executeScript',
					'expandText',
					'get',
					'getChildren',
					'getStatusExplanation',
					'getSubTree',
					'setMaintenance',
					'setManaged',
				],
			},
		},
	},

	// -------------------------------------------
	// Get Many
	// -------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Return only objects whose name or alias contains this string',
			},
			{
				displayName: 'Parent Object ID',
				name: 'parent',
				type: 'number',
				default: 0,
				description: 'Return only direct children of this parent object. Leave 0 for top-level.',
			},
		],
	},

	// -------------------------------------------
	// Get Children
	// -------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getChildren'],
			},
		},
		options: [
			{
				displayName: 'Class Filter',
				name: 'class',
				type: 'string',
				default: '',
				placeholder: 'Node,Container',
				description: 'Comma-separated list of object class names to filter children by',
			},
			{
				displayName: 'Name Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Return only children whose name or alias contains this string',
			},
		],
	},

	// -------------------------------------------
	// Get Sub-Tree
	// -------------------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getSubTree'],
			},
		},
		options: [
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Return only objects whose name or alias contains this string',
			},
		],
	},

	// -------------------------------------------
	// Search
	// -------------------------------------------
	{
		displayName: 'Search Criteria',
		name: 'searchCriteria',
		type: 'collection',
		placeholder: 'Add Criterion',
		default: {},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				default: '',
				description: 'Filter by primary IP address',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by name or alias (substring match)',
			},
			{
				displayName: 'Object Class',
				name: 'class',
				type: 'multiOptions',
				default: [],
				options: [
					{ name: 'Access Point', value: 'AccessPoint' },
					{ name: 'Business Service', value: 'BusinessService' },
					{ name: 'Chassis', value: 'Chassis' },
					{ name: 'Cluster', value: 'Cluster' },
					{ name: 'Container', value: 'Container' },
					{ name: 'Dashboard', value: 'Dashboard' },
					{ name: 'Interface', value: 'Interface' },
					{ name: 'Mobile Device', value: 'MobileDevice' },
					{ name: 'Network Map', value: 'NetworkMap' },
					{ name: 'Node', value: 'Node' },
					{ name: 'Sensor', value: 'Sensor' },
					{ name: 'Subnet', value: 'Subnet' },
					{ name: 'Template', value: 'Template' },
					{ name: 'Zone', value: 'Zone' },
				],
				description: 'Filter by object class',
			},
			{
				displayName: 'Parent Object ID',
				name: 'parent',
				type: 'number',
				default: 0,
				description: 'Return only objects that are children (direct or indirect) of this object',
			},
			{
				displayName: 'Zone UIN',
				name: 'zoneUIN',
				type: 'number',
				default: 0,
				description: 'Filter by zone UIN',
			},
		],
	},

	// -------------------------------------------
	// Set Maintenance
	// -------------------------------------------
	{
		displayName: 'Maintenance Mode',
		name: 'maintenance',
		type: 'boolean',
		default: true,
		required: true,
		description: 'Whether to enable (true) or disable (false) maintenance mode',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['setMaintenance'],
			},
		},
	},
	{
		displayName: 'Comments',
		name: 'comments',
		type: 'string',
		default: '',
		description: 'Optional maintenance comments',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['setMaintenance'],
			},
		},
	},

	// -------------------------------------------
	// Set Managed
	// -------------------------------------------
	{
		displayName: 'Managed',
		name: 'managed',
		type: 'boolean',
		default: true,
		required: true,
		description: 'Whether to manage (true) or unmanage (false) the object',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['setManaged'],
			},
		},
	},

	// -------------------------------------------
	// Execute Script
	// -------------------------------------------
	{
		displayName: 'Script',
		name: 'script',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		default: '',
		required: true,
		description: 'NXSL script source code to execute',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['executeScript'],
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
				resource: ['object'],
				operation: ['executeScript'],
			},
		},
		options: [
			{
				displayName: 'Parameters',
				name: 'parameters',
				type: 'string',
				default: '',
				description: 'Comma-separated list of parameters to pass to the script',
			},
			{
				displayName: 'Return Result as Map',
				name: 'resultAsMap',
				type: 'boolean',
				default: false,
				description: 'Whether to always present the result as a JSON object map',
			},
		],
	},

	// -------------------------------------------
	// Expand Text
	// -------------------------------------------
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. Host: %{node.name} — Status: %{node.status}',
		description: 'Text containing NetXMS macros to expand',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['expandText'],
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
				resource: ['object'],
				operation: ['expandText'],
			},
		},
		options: [
			{
				displayName: 'Alarm ID',
				name: 'alarmId',
				type: 'number',
				default: 0,
				description: 'Alarm ID to use for alarm-related macro expansion',
			},
		],
	},
];

import type { INodeProperties } from 'n8n-workflow';

export const serverOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['server'],
			},
		},
		options: [
			{
				name: 'Get Info',
				value: 'getInfo',
				description: 'Get detailed server information including version and configuration',
				action: 'Get server info',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get current session status and user information',
				action: 'Get session status',
			},
		],
		default: 'getInfo',
	},
];

export const serverFields: INodeProperties[] = [];

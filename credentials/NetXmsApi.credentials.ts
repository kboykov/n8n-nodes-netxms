import type { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class NetXmsApi implements ICredentialType {
	name = 'netXmsApi';

	displayName = 'NetXMS API';

	documentationUrl = 'https://netxms.org/documentation/';

	properties: INodeProperties[] = [
		{
			displayName: 'Server URL',
			name: 'serverUrl',
			type: 'string',
			default: '',
			placeholder: 'https://your-netxms-server',
			description: 'Base URL of your NetXMS server, without trailing slash',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: '={{$credentials.serverUrl}}',
			url: '/v1/login',
			body: {
				login: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};
}

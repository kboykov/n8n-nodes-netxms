import type {
	IAuthenticate,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

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

	authenticate: IAuthenticate = async (credentials, requestOptions) => {
		const sessionToken = credentials.sessionToken as string | undefined;
		if (sessionToken) {
			requestOptions.headers = {
				...requestOptions.headers,
				Authorization: `Bearer ${sessionToken}`,
			};
		}

		return requestOptions;
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: '={{$credentials.serverUrl}}',
			url: '/v1/login',
			body: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		},
	};
}

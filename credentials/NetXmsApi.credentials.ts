import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class NetXmsApi implements ICredentialType {
	name = 'netXmsApi';

	displayName = 'NetXMS API';

	documentationUrl = 'https://netxms.org/documentation/';

	// References the credentialTest method defined in NetXms.node.ts
	testedBy = 'testNetXmsCredentials';

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
}

import type {
	ICredentialTestFunctions,
	ICredentialsDecrypted,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { alarmCategoryFields, alarmCategoryOperations } from './descriptions/AlarmCategoryDescription';
import { alarmFields, alarmOperations } from './descriptions/AlarmDescription';
import {
	dataCollectionFields,
	dataCollectionOperations,
} from './descriptions/DataCollectionDescription';
import {
	eventTemplateFields,
	eventTemplateOperations,
} from './descriptions/EventTemplateDescription';
import { findFields, findOperations } from './descriptions/FindDescription';
import { objectFields, objectOperations } from './descriptions/ObjectDescription';
import {
	scheduledTaskFields,
	scheduledTaskOperations,
} from './descriptions/ScheduledTaskDescription';
import { serverFields, serverOperations } from './descriptions/ServerDescription';
import { userFields, userOperations } from './descriptions/UserDescription';

interface NetXmsCredentials {
	serverUrl: string;
	username: string;
	password: string;
}

export class NetXms implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NetXMS',
		name: 'netXms',
		icon: 'file:../../icons/netxms.svg',
		// 'input' is correct for nodes that fetch / mutate data in an external system
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the NetXMS network monitoring and management system',
		defaults: {
			name: 'NetXMS',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'netXmsApi',
				required: true,
			},
		],
		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Alarm',
						value: 'alarm',
						description: 'Manage alarms raised by the monitoring system',
					},
					{
						name: 'Alarm Category',
						value: 'alarmCategory',
						description: 'Manage alarm categories used to classify alarms',
					},
					{
						name: 'Data Collection',
						value: 'dataCollection',
						description: 'Read DCI current values and historical data',
					},
					{
						name: 'Event Template',
						value: 'eventTemplate',
						description: 'Manage event templates that define how events are generated',
					},
					{
						name: 'Find',
						value: 'find',
						description: 'Search the network topology by MAC address or connection history',
					},
					{
						name: 'Object',
						value: 'object',
						description: 'Manage NetXMS objects (nodes, containers, interfaces, etc.)',
					},
					{
						name: 'Scheduled Task',
						value: 'scheduledTask',
						description: 'Manage server-side scheduled tasks',
					},
					{
						name: 'Server',
						value: 'server',
						description: 'Retrieve server information and session status',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Manage NetXMS users',
					},
				],
				default: 'alarm',
			},

			// ── Operations (one block per resource) ─────────────────────
			...alarmOperations,
			...alarmCategoryOperations,
			...dataCollectionOperations,
			...eventTemplateOperations,
			...findOperations,
			...objectOperations,
			...scheduledTaskOperations,
			...serverOperations,
			...userOperations,

			// ── Fields (one block per resource) ─────────────────────────
			...alarmFields,
			...alarmCategoryFields,
			...dataCollectionFields,
			...eventTemplateFields,
			...findFields,
			...objectFields,
			...scheduledTaskFields,
			...serverFields,
			...userFields,
		],
	};

	// Placed after description per n8n convention
	methods = {
		credentialTest: {
			async testNetXmsCredentials(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const { serverUrl, username, password } = credential.data as unknown as NetXmsCredentials;

				if (!serverUrl) {
					return { status: 'Error', message: 'Server URL is required' };
				}

				try {
					const response = await this.helpers.request({
						method: 'POST',
						url: `${serverUrl.replace(/\/$/, '')}/v1/login`,
						body: JSON.stringify({ username, password }),
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/json',
						},
						resolveWithFullResponse: true,
						simple: false,
					});

					const statusCode = response.statusCode as number;
					if (statusCode === 201) {
						return { status: 'OK', message: 'Authentication successful' };
					}
					if (statusCode === 401 || statusCode === 403) {
						return { status: 'Error', message: 'Invalid username or password' };
					}
					return { status: 'Error', message: `Unexpected response status: ${statusCode}` };
				} catch (error) {
					return {
						status: 'Error',
						message: `Connection failed: ${(error as Error).message}`,
					};
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = (await this.getCredentials('netXmsApi')) as NetXmsCredentials;
		const serverUrl = credentials.serverUrl.replace(/\/$/, '');

		// Obtain one session token for the entire execution — avoids per-item logins
		let token: string;
		try {
			const loginResponse = await this.helpers.httpRequest({
				method: 'POST',
				url: `${serverUrl}/v1/login`,
				body: { username: credentials.username, password: credentials.password },
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				json: true,
			});
			token = loginResponse.token as string;
			if (!token) {
				throw new Error('Login response did not contain a token');
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Authentication failed: ${(error as Error).message}`,
			);
		}

		// Typed helper — avoids null assertions and repetitive headers
		const makeRequest = async (
			method: IHttpRequestMethods,
			path: string,
			body?: IDataObject,
			qs?: IDataObject,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		): Promise<any> => {
			return this.helpers.httpRequest({
				method,
				url: `${serverUrl}${path}`,
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body,
				qs: qs && Object.keys(qs).length ? qs : undefined,
				json: true,
			});
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData: IDataObject | IDataObject[];

				// ── ALARM ────────────────────────────────────────────────
				if (resource === 'alarm') {
					if (operation === 'getMany') {
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const qs: IDataObject = {};
						if (fields.rootObject) qs.rootObject = fields.rootObject;
						if (fields.includeObjectDetails) qs.includeObjectDetails = fields.includeObjectDetails;
						responseData = await makeRequest('GET', '/v1/alarms', undefined, qs);
					} else if (operation === 'get') {
						const alarmId = this.getNodeParameter('alarmId', i) as number;
						responseData = await makeRequest('GET', `/v1/alarms/${alarmId}`);
					} else if (operation === 'acknowledge') {
						const alarmId = this.getNodeParameter('alarmId', i) as number;
						await makeRequest('POST', `/v1/alarms/${alarmId}/acknowledge`);
						responseData = { success: true, alarmId };
					} else if (operation === 'resolve') {
						const alarmId = this.getNodeParameter('alarmId', i) as number;
						await makeRequest('POST', `/v1/alarms/${alarmId}/resolve`);
						responseData = { success: true, alarmId };
					} else if (operation === 'terminate') {
						const alarmId = this.getNodeParameter('alarmId', i) as number;
						await makeRequest('POST', `/v1/alarms/${alarmId}/terminate`);
						responseData = { success: true, alarmId };
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
					}

				// ── ALARM CATEGORY ───────────────────────────────────────
				} else if (resource === 'alarmCategory') {
					if (operation === 'getMany') {
						responseData = await makeRequest('GET', '/v1/alarm-categories');
					} else if (operation === 'get') {
						const categoryId = this.getNodeParameter('categoryId', i) as number;
						responseData = await makeRequest('GET', `/v1/alarm-categories/${categoryId}`);
					} else if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						responseData = await makeRequest('POST', '/v1/alarm-categories', { name, ...fields });
					} else if (operation === 'update') {
						const categoryId = this.getNodeParameter('categoryId', i) as number;
						const fields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await makeRequest('PUT', `/v1/alarm-categories/${categoryId}`, fields);
					} else if (operation === 'delete') {
						const categoryId = this.getNodeParameter('categoryId', i) as number;
						await makeRequest('DELETE', `/v1/alarm-categories/${categoryId}`);
						responseData = { success: true, categoryId };
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
					}

				// ── DATA COLLECTION ──────────────────────────────────────
				} else if (resource === 'dataCollection') {
					if (operation === 'getCurrentValues') {
						const objectId = this.getNodeParameter('objectId', i) as number;
						responseData = await makeRequest(
							'GET',
							`/v1/objects/${objectId}/data-collection/current-values`,
						);
					} else if (operation === 'getHistory') {
						const objectId = this.getNodeParameter('objectId', i) as number;
						const dciId = this.getNodeParameter('dciId', i) as number;
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const qs: IDataObject = {};
						if (fields.timeFrom) qs.timeFrom = fields.timeFrom;
						if (fields.timeTo) qs.timeTo = fields.timeTo;
						if (fields.maxRows) qs.maxRows = fields.maxRows;
						if (fields.maxDataPoints) qs.maxDataPoints = fields.maxDataPoints;
						if (fields.tier) qs.tier = fields.tier;
						if (fields.function) qs.function = fields.function;
						responseData = await makeRequest(
							'GET',
							`/v1/objects/${objectId}/data-collection/${dciId}/history`,
							undefined,
							qs,
						);
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
					}

				// ── EVENT TEMPLATE ───────────────────────────────────────
				} else if (resource === 'eventTemplate') {
					if (operation === 'getMany') {
						responseData = await makeRequest('GET', '/v1/event-templates');
					} else if (operation === 'get') {
						const eventCode = this.getNodeParameter('eventCode', i) as number;
						responseData = await makeRequest('GET', `/v1/event-templates/${eventCode}`);
					} else if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						responseData = await makeRequest('POST', '/v1/event-templates', { name, ...fields });
					} else if (operation === 'update') {
						const eventCode = this.getNodeParameter('eventCode', i) as number;
						const fields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await makeRequest('PUT', `/v1/event-templates/${eventCode}`, fields);
					} else if (operation === 'delete') {
						const eventCode = this.getNodeParameter('eventCode', i) as number;
						await makeRequest('DELETE', `/v1/event-templates/${eventCode}`);
						responseData = { success: true, eventCode };
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
					}

				// ── FIND ─────────────────────────────────────────────────
				} else if (resource === 'find') {
					if (operation === 'findMacAddress') {
						const macAddress = this.getNodeParameter('macAddress', i) as string;
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const qs: IDataObject = { macAddress };
						if (fields.searchLimit) qs.searchLimit = fields.searchLimit;
						if (fields.includeObjects !== undefined) qs.includeObjects = fields.includeObjects;
						responseData = await makeRequest('GET', '/v1/find/mac-address', undefined, qs);
					} else if (operation === 'getConnectionHistory') {
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const qs: IDataObject = {};
						if (fields.macAddress) qs.macAddress = fields.macAddress;
						if (fields.nodeId) qs.nodeId = fields.nodeId;
						if (fields.switchId) qs.switchId = fields.switchId;
						if (fields.interfaceId) qs.interfaceId = fields.interfaceId;
						if (fields.from) qs.from = fields.from;
						if (fields.to) qs.to = fields.to;
						if (fields.limit) qs.limit = fields.limit;
						responseData = await makeRequest('GET', '/v1/connection-history', undefined, qs);
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
					}

				// ── OBJECT ───────────────────────────────────────────────
				} else if (resource === 'object') {
					if (operation === 'getMany') {
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const qs: IDataObject = {};
						if (fields.filter) qs.filter = fields.filter;
						if (fields.parent) qs.parent = fields.parent;
						responseData = await makeRequest('GET', '/v1/objects', undefined, qs);
					} else if (operation === 'get') {
						const objectId = this.getNodeParameter('objectId', i) as number;
						responseData = await makeRequest('GET', `/v1/objects/${objectId}`);
					} else if (operation === 'getChildren') {
						const objectId = this.getNodeParameter('objectId', i) as number;
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const qs: IDataObject = {};
						if (fields.class) qs.class = fields.class;
						if (fields.filter) qs.filter = fields.filter;
						responseData = await makeRequest('GET', `/v1/objects/${objectId}/children`, undefined, qs);
					} else if (operation === 'getSubTree') {
						const objectId = this.getNodeParameter('objectId', i) as number;
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const qs: IDataObject = {};
						if (fields.filter) qs.filter = fields.filter;
						responseData = await makeRequest('GET', `/v1/objects/${objectId}/sub-tree`, undefined, qs);
					} else if (operation === 'getStatusExplanation') {
						const objectId = this.getNodeParameter('objectId', i) as number;
						responseData = await makeRequest('GET', `/v1/objects/${objectId}/status-explanation`);
					} else if (operation === 'search') {
						const criteria = this.getNodeParameter('searchCriteria', i) as IDataObject;
						const body: IDataObject = {};
						if (criteria.name) body.name = criteria.name;
						if (criteria.ipAddress) body.ipAddress = criteria.ipAddress;
						if (criteria.parent) body.parent = criteria.parent;
						if (criteria.zoneUIN) body.zoneUIN = criteria.zoneUIN;
						if (Array.isArray(criteria.class) && criteria.class.length) {
							body.class = criteria.class;
						}
						responseData = await makeRequest('POST', '/v1/objects/search', body);
					} else if (operation === 'setMaintenance') {
						const objectId = this.getNodeParameter('objectId', i) as number;
						const maintenance = this.getNodeParameter('maintenance', i) as boolean;
						const comments = this.getNodeParameter('comments', i, '') as string;
						const body: IDataObject = { maintenance };
						if (comments) body.comments = comments;
						await makeRequest('POST', `/v1/objects/${objectId}/set-maintenance`, body);
						responseData = { success: true, objectId, maintenance };
					} else if (operation === 'setManaged') {
						const objectId = this.getNodeParameter('objectId', i) as number;
						const managed = this.getNodeParameter('managed', i) as boolean;
						await makeRequest('POST', `/v1/objects/${objectId}/set-managed`, { managed });
						responseData = { success: true, objectId, managed };
					} else if (operation === 'executeScript') {
						const objectId = this.getNodeParameter('objectId', i) as number;
						const script = this.getNodeParameter('script', i) as string;
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = { script };
						if (fields.parameters) {
							body.parameters = (fields.parameters as string)
								.split(',')
								.map((p) => p.trim())
								.filter(Boolean);
						}
						if (fields.resultAsMap !== undefined) body.resultAsMap = fields.resultAsMap;
						responseData = await makeRequest('POST', `/v1/objects/${objectId}/execute-script`, body);
					} else if (operation === 'expandText') {
						const objectId = this.getNodeParameter('objectId', i) as number;
						const text = this.getNodeParameter('text', i) as string;
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = { text };
						if (fields.alarmId) body.alarmId = fields.alarmId;
						responseData = await makeRequest('POST', `/v1/objects/${objectId}/expand-text`, body);
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
					}

				// ── SCHEDULED TASK ───────────────────────────────────────
				} else if (resource === 'scheduledTask') {
					if (operation === 'getMany') {
						responseData = await makeRequest('GET', '/v1/scheduled-tasks');
					} else if (operation === 'get') {
						const taskId = this.getNodeParameter('taskId', i) as number;
						responseData = await makeRequest('GET', `/v1/scheduled-tasks/${taskId}`);
					} else if (operation === 'create') {
						const taskHandler = this.getNodeParameter('taskHandler', i) as string;
						const scheduleType = this.getNodeParameter('scheduleType', i) as string;
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = { taskHandler, ...fields };
						if (scheduleType === 'cron') {
							body.schedule = this.getNodeParameter('schedule', i) as string;
						} else {
							body.executionTime = this.getNodeParameter('executionTime', i) as number;
						}
						responseData = await makeRequest('POST', '/v1/scheduled-tasks', body);
					} else if (operation === 'update') {
						const taskId = this.getNodeParameter('taskId', i) as number;
						const fields = this.getNodeParameter('updateFields', i) as IDataObject;
						// Zero executionTime means "not set" — omit it to avoid clobbering a cron schedule
						if (fields.executionTime === 0) delete fields.executionTime;
						responseData = await makeRequest('PUT', `/v1/scheduled-tasks/${taskId}`, fields);
					} else if (operation === 'delete') {
						const taskId = this.getNodeParameter('taskId', i) as number;
						await makeRequest('DELETE', `/v1/scheduled-tasks/${taskId}`);
						responseData = { success: true, taskId };
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
					}

				// ── SERVER ───────────────────────────────────────────────
				} else if (resource === 'server') {
					if (operation === 'getInfo') {
						responseData = await makeRequest('GET', '/v1/server-info');
					} else if (operation === 'getStatus') {
						responseData = await makeRequest('GET', '/v1/status');
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
					}

				// ── USER ─────────────────────────────────────────────────
				} else if (resource === 'user') {
					if (operation === 'getMany') {
						responseData = await makeRequest('GET', '/v1/users');
					} else if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as number;
						responseData = await makeRequest('GET', `/v1/users/${userId}`);
					} else if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const fields = this.getNodeParameter('additionalFields', i) as IDataObject;
						responseData = await makeRequest('POST', '/v1/users', { name, ...fields });
					} else if (operation === 'update') {
						const userId = this.getNodeParameter('userId', i) as number;
						const fields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await makeRequest('PUT', `/v1/users/${userId}`, fields);
					} else if (operation === 'delete') {
						const userId = this.getNodeParameter('userId', i) as number;
						await makeRequest('DELETE', `/v1/users/${userId}`);
						responseData = { success: true, userId };
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
					}

				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

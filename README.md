# n8n-nodes-netxms

An [n8n](https://n8n.io/) community node for [NetXMS](https://netxms.org/) — an open-source enterprise-grade network monitoring and management system.

This node lets you interact with the NetXMS REST API directly from your n8n workflows: acknowledge alarms, query DCI history, manage objects, run NXSL scripts, and much more.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-netxms.svg)](https://www.npmjs.com/package/n8n-nodes-netxms)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![n8n community node](https://img.shields.io/badge/n8n-community--node-orange)](https://docs.n8n.io/integrations/community-nodes/)

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Credentials](#credentials)
- [Resources & Operations](#resources--operations)
  - [Alarm](#alarm)
  - [Alarm Category](#alarm-category)
  - [Data Collection](#data-collection)
  - [Event Template](#event-template)
  - [Find](#find)
  - [Object](#object)
  - [Scheduled Task](#scheduled-task)
  - [Server](#server)
  - [User](#user)
- [Usage Examples](#usage-examples)
- [Development](#development)
- [Compatibility](#compatibility)
- [License](#license)

---

## Features

- **41 operations** across 9 NetXMS resource types
- Single login per workflow execution — one Bearer token reused for all API calls
- Built-in credential testing (click "Test" on the credential card to verify connectivity)
- `continueOnFail` support — process remaining items even when one fails
- Compatible with n8n's **AI Tool** interface (`usableAsTool: true`)
- Full TypeScript source with strict mode enabled

---

## Prerequisites

| Requirement | Version |
|---|---|
| n8n | ≥ 1.0.0 |
| NetXMS Server | ≥ 4.x (REST API v1) |
| Node.js | ≥ 18.x |

---

## Installation

### Via n8n UI (recommended)

1. Open n8n → **Settings** → **Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-netxms` and confirm

### Via npm (self-hosted)

```bash
npm install n8n-nodes-netxms
```

Then restart your n8n instance.

---

## Credentials

Create a **NetXMS API** credential with the following fields:

| Field | Description | Example |
|---|---|---|
| **Server URL** | Base URL of the NetXMS server (no trailing slash) | `https://netxms.example.com` |
| **Username** | NetXMS user account | `admin` |
| **Password** | Account password | `••••••••` |

The node authenticates by calling `POST /v1/login` at the start of each execution and uses the returned Bearer token for all subsequent requests. Click **Test connection** on the credential card to verify that the server is reachable and the credentials are correct.

> **Tip:** Create a dedicated read-only API user in NetXMS for n8n workflows that only need to read data.

---

## Resources & Operations

### Alarm

| Operation | Description |
|---|---|
| **Acknowledge** | Acknowledge an open alarm |
| **Get** | Get full details of a specific alarm |
| **Get Many** | List all active alarms (optionally filter by root object) |
| **Resolve** | Move an alarm to the resolved state |
| **Terminate** | Permanently terminate an alarm |

**Get Many** optional filters:
- `rootObject` — return only alarms under this object ID
- `includeObjectDetails` — embed full object info in each alarm record

---

### Alarm Category

| Operation | Description |
|---|---|
| **Create** | Create a new alarm category |
| **Delete** | Delete an alarm category |
| **Get** | Get details of a specific alarm category |
| **Get Many** | Retrieve all configured alarm categories |
| **Update** | Update an existing alarm category |

---

### Data Collection

| Operation | Description |
|---|---|
| **Get Current Values** | Get the latest collected value for all DCIs on an object |
| **Get History** | Retrieve historical data for a specific DCI |

**Get History** optional filters:
- `timeFrom` / `timeTo` — Unix timestamp range
- `maxRows` / `maxDataPoints` — result size cap
- `tier` — data aggregation tier (`auto`, `raw`, `hourly`, `daily`)
- `function` — aggregation function (`avg`, `min`, `max`, `minmax`)

---

### Event Template

| Operation | Description |
|---|---|
| **Create** | Create a new event template |
| **Delete** | Delete a user-defined event template (code ≥ 100000) |
| **Get** | Get details of a specific event template by event code |
| **Get Many** | Retrieve all event templates |
| **Update** | Update an existing event template |

---

### Find

| Operation | Description |
|---|---|
| **Find MAC Address** | Locate a MAC address (full or partial) in the network topology |
| **Get Connection History** | Query the MAC address connection history log |

**Find MAC Address** optional fields:
- `searchLimit` — maximum number of results (default 100)
- `includeObjects` — embed full object details in each result

**Get Connection History** optional filters: `macAddress`, `nodeId`, `switchId`, `interfaceId`, `from`, `to`, `limit`

---

### Object

| Operation | Description |
|---|---|
| **Execute Script** | Run an NXSL script in the context of an object |
| **Expand Text** | Expand NetXMS macros in a text string |
| **Get** | Get full details of a specific object |
| **Get Children** | Get all direct child objects |
| **Get Many** | List objects, optionally filtered by name or parent |
| **Get Status Explanation** | Get a detailed breakdown of how object status was calculated |
| **Get Sub-Tree** | Retrieve all objects in the sub-tree under a parent |
| **Search** | Search objects by name, IP address, class, parent, or zone |
| **Set Maintenance** | Enter or leave maintenance mode |
| **Set Managed** | Manage or unmanage an object |

---

### Scheduled Task

| Operation | Description |
|---|---|
| **Create** | Create a scheduled task (cron or one-time) |
| **Delete** | Delete a scheduled task |
| **Get** | Get details of a specific scheduled task |
| **Get Many** | List all scheduled tasks |
| **Update** | Update an existing scheduled task |

When creating a task, select **Schedule Type**:
- `Cron` — provide a cron expression (e.g. `0 2 * * *`)
- `One-Time` — provide a Unix timestamp for the single execution

---

### Server

| Operation | Description |
|---|---|
| **Get Info** | Retrieve server version, build, and configuration details |
| **Get Status** | Retrieve current server session and runtime status |

---

### User

| Operation | Description |
|---|---|
| **Create** | Create a new NetXMS user |
| **Delete** | Delete a user |
| **Get** | Get details of a specific user |
| **Get Many** | List all users |
| **Update** | Update user properties |

---

## Usage Examples

### Acknowledge all critical alarms for an object

1. Add a **NetXMS** node with resource **Alarm** → **Get Many**
2. Set `rootObject` to your target object ID
3. Connect to a **Split In Batches** or **Loop Over Items** node
4. Add another **NetXMS** node with resource **Alarm** → **Acknowledge**, expression `{{ $json.id }}` as Alarm ID

### Put a node in maintenance before a deployment

```
[Manual Trigger] → [NetXMS: Object → Set Maintenance] → [Deploy step] → [NetXMS: Object → Set Maintenance (disable)]
```

Set **Maintenance Mode** to `true` before the deployment and `false` after. Optionally add a comment like `"Deployment window"`.

### Query DCI history and send an alert

1. **NetXMS** → Data Collection → **Get History** (objectId + dciId, timeFrom = last hour)
2. **IF** node to check if any value exceeds a threshold
3. **Slack** / **Email** node to send the alert

---

## Development

### Requirements

- Node.js ≥ 18
- npm ≥ 9

### Setup

```bash
git clone https://github.com/kboykov/n8n-netxms-node.git
cd n8n-netxms-node
npm install
```

### Build

```bash
npm run build
```

This runs `tsc` (TypeScript compiler) followed by `gulp build:icons` to copy the SVG icon into `dist/`.

### Lint

```bash
npm run lint
npm run lintfix   # auto-fix where possible
```

### Local testing with n8n

```bash
# In this repo
npm link

# In your local n8n installation directory
npm link n8n-nodes-netxms
```

Then restart n8n. The NetXMS node will appear in the node picker.

### Project structure

```
n8n-nodes-netxms/
├── credentials/
│   └── NetXmsApi.credentials.ts     # Credential definition
├── nodes/
│   └── NetXms/
│       ├── NetXms.node.ts            # Main node implementation
│       └── descriptions/
│           ├── AlarmDescription.ts
│           ├── AlarmCategoryDescription.ts
│           ├── DataCollectionDescription.ts
│           ├── EventTemplateDescription.ts
│           ├── FindDescription.ts
│           ├── ObjectDescription.ts
│           ├── ScheduledTaskDescription.ts
│           ├── ServerDescription.ts
│           └── UserDescription.ts
├── icons/
│   └── netxms.svg
├── gulpfile.js
├── package.json
└── tsconfig.json
```

---

## Compatibility

| n8n-workflow | Status |
|---|---|
| 2.x | Supported |
| 1.x | Not tested |

Tested against **NetXMS REST API v1** (NetXMS ≥ 4.x).

---

## License

[MIT](LICENSE)

---

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss any significant changes.

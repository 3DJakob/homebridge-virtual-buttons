# homebridge-virtual-buttons

A simple Homebridge accessory with 5 stateless buttons and HTTP endpoints to trigger them.

## Installation

```bash
npm install -g homebridge-virtual-buttons
```

## Configuration

Add this to your Homebridge config.json:

```json
"accessories": [
  {
    "accessory": "VirtualButtons",
    "name": "Virtual Buttons",
    "port": 3000
  }
]
```

## Usage

Trigger a button via HTTP POST:

```bash
curl -X POST http://<homebridge-ip>:3000/button/1
```

Replace `<homebridge-ip>` with the IP address of your Homebridge server and `1` with the button number (1-5).

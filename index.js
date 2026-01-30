const express = require("express");

let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory(
    "homebridge-virtual-buttons",
    "VirtualButtons",
    VirtualButtonsAccessory
  );
};

class VirtualButtonsAccessory {
  constructor(log, config, api) {
    this.log = log;
    this.name = config.name || "Virtual Buttons";

    // Create 5 stateless buttons with unique subtypes
    const buttonNames = config.buttons || ["Button 1","Button 2","Button 3","Button 4","Button 5"];
    this.buttons = [];
    for (let i = 0; i < 5; i++) {
      const serviceName = buttonNames[i] || `Button ${i+1}`;
      const service = new Service.StatelessProgrammableSwitch(serviceName, `button-${i+1}`);
      service
        .getCharacteristic(Characteristic.ProgrammableSwitchEvent)
        .on("get", (callback) => callback(null, 0));
      this.buttons.push(service);
    }

    // Setup HTTP server to trigger buttons
    const app = express();
    app.use(express.json());

    app.post("/button/:id", (req, res) => {
      const id = parseInt(req.params.id);
      if (id < 1 || id > 5) return res.status(400).send("Button id must be 1-5");

      const button = this.buttons[id - 1];
      const event = Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;

      // Send the event twice with a short delay to ensure HomeKit detects it
      button.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(event);
      setTimeout(() => {
        button.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(event);
      }, 100);

      this.log(`Button ${id} pressed via HTTP`);

      res.send(`Button ${id} pressed`);
    });

    const port = config.port || 3000;
    app.listen(port, () => this.log(`Virtual Buttons HTTP server running on port ${port}`));
  }

  getServices() {
    return this.buttons;
  }
}
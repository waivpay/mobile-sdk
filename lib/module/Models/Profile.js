function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class Profile {
  constructor(id, guid, first_name, last_name, email, mobile_number, marketing_preference, number_plate, number_plate_state, preferred_location, allow_notifications, allow_location, notifications_guid, device_type) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "guid", void 0);

    _defineProperty(this, "first_name", void 0);

    _defineProperty(this, "last_name", void 0);

    _defineProperty(this, "email", void 0);

    _defineProperty(this, "mobile_number", void 0);

    _defineProperty(this, "marketing_preference", void 0);

    _defineProperty(this, "number_plate", void 0);

    _defineProperty(this, "number_plate_state", void 0);

    _defineProperty(this, "preferred_location", void 0);

    _defineProperty(this, "allow_notifications", void 0);

    _defineProperty(this, "allow_location", void 0);

    _defineProperty(this, "notifications_guid", void 0);

    _defineProperty(this, "device_type", void 0);

    this.id = id;
    this.guid = guid;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.mobile_number = mobile_number;
    this.marketing_preference = marketing_preference;
    this.number_plate = number_plate;
    this.number_plate_state = number_plate_state;
    this.preferred_location = preferred_location;
    this.allow_notifications = allow_notifications;
    this.allow_location = allow_location;
    this.notifications_guid = notifications_guid;
    this.device_type = device_type;
  }

}
//# sourceMappingURL=Profile.js.mapofile.js.map
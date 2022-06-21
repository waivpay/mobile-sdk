export class Profile {
    id: number;
    guid: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    marketing_preference: boolean;
    number_plate: string;
    number_plate_state: string;
    preferred_location: string;
    allow_notifications: boolean;
    allow_location: boolean;
    notifications_guid: string;
    device_type: string;
  
    constructor(id: number,
        guid: string,
        first_name: string,
        last_name: string,
        email: string,
        mobile_number: string,
        marketing_preference: boolean,
        number_plate: string,
        number_plate_state: string,
        preferred_location: string,
        allow_notifications: boolean,
        allow_location: boolean,
        notifications_guid: string,
        device_type: string) {
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
  
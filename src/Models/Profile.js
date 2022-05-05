export class Profile {
    id;
    guid;
    first_name;
    last_name;
    email;
    mobile_number;
    marketing_preference;
    number_plate;
    number_plate_state;
    preferred_location;
    allow_notifications;
    allow_location;
    notifications_guid;
    device_type;

    constructor(id, guid, first_name, last_name, email, mobile_number, marketing_preference, number_plate, number_plate_state, preferred_location, allow_notifications, allow_location, notifications_guid, device_type) { 
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
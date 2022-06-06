export class Form_Schema_Item {
    id;
    type;
    label;
    hint;
    required;
    example_image;
    example_text;
    constructor(id,type,label,hint,required,example_image,example_text)
    {
        this.id = id;
        this.type = type;
        this.label = label;
        this.hint = hint;
        this.required = required;
        this.example_image = example_image;
        this.example_text = example_text;
    }
}
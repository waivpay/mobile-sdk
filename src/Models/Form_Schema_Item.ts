export class Form_Schema_Item {
    id: string;
    type: string;
    label: string;
    hint: string;
    required: boolean;
    example_image: string;
    example_text: string;
    constructor(id:string,type:string,label:string,hint:string,required:boolean,example_image:string,example_text:string)
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
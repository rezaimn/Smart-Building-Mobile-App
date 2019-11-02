export class SkSliderModel {
    public inServiceDisplayCount=0;
    public inServiceKioskCount=0;
    public outOfServiceDisplayCount=0;
    public outOfServiceKioskCount=0;
    constructor(data: any = {}) {
        this.inServiceDisplayCount=data.inServiceDisplayCount||0;
        this.inServiceKioskCount=data.inServiceKioskCount||0;
        this.outOfServiceDisplayCount=data.outOfServiceDisplayCount||0;
        this.outOfServiceKioskCount=data.outOfServiceKioskCount||0;
    }
}

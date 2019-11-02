import {Injectable} from '@angular/core';
import {StackModel} from '../../stack.model';

@Injectable()
export class RouteStackService {
    public stack:StackModel[]=[];
    push(route:string,index:number){
        route=route.replace('/','');
        let stackItem:StackModel=new StackModel(route,index);
        this.stack.push(stackItem);
        console.log(this.stack);
    }
    pop(){
        return this.stack.pop();
    }
    empetyStack(){
        this.stack.splice(0,this.stack.length);
    }
    isEmpety(){
        if(this.stack.length>0){
            return false;
        }else{
            return true;
        }
    }
    stackLenght(){
        return this.stack.length;
    }

}

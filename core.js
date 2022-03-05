export class Main{

    #World = {};
    #Object = {};

    call(_args){

        const {propertyName,args} = _args;
        
        if(typeof this.#World[args.address][propertyName] === "function"){

            this.Object[_args.id] = this.#World[args.address][propertyName](args);
        
        }else{

            this.Object[_args.id] = this.#World[args.address][propertyName];

        }
    }

    callGroup(_args){

        if(_args instanceof Array) for(const x of _args){

            this.call(x);

        }

        else throw Error("callGroup arguments must be an Array");

    }

    register(prototype,args,address){

        this.#World[address] = new prototype(args);

    }

    getObject(id){

        return this.#Object[id];

    }

}
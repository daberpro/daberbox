import { Body, Box, ConvexPolyhedron, Cylinder, Plane, Sphere, Vec3, World } from "cannon-es";


export class Physics{

    #World = null;

    Init({x,y,z}){

        // inisalisasi dunia dan membuat gravitasi
        
        this.#World = new World({
            gravity: new Vec3(x,y,z)
        });

        return this.#World;

    }

    BoxBody({width = 1, height = 1, depth = 1, options}){

        const box = new Box(new Vec3(width / 2,height / 2, depth / 2));
        const body = new Body(options);
        body.addShape(box);
        this.#World.addBody(body);

        return body;

    }

    SphereBody({radius = 1, options}){

        
        const sphere = new Sphere(radius);
        const body = new Body(options);
        body.addShape(sphere);
        this.#World.addBody(body);

        return body;

    }

    CylinderBody({radiusTop,radiusBottom,height,numSegments, options}){

        
        const cylinder = new Cylinder(radiusTop,radiusBottom,height,numSegments);
        const body = new Body(options);
        body.addShape(cylinder);
        this.#World.addBody(body);

        return body;

    }

    PlaneBody({options}){

        const plane = new Plane();
        const body = new Body(options);
        body.addShape(plane);
        this.#World.addBody(body);

        return body;

    }

    ConvexBody({
        vertices,
        faces,
        options
    }){

        const convexShape = new ConvexPolyhedron({ vertices, faces })
        const convexBody = new Body(Object.assign(options,{shape: convexShape}));
        this.#World.addBody(convexBody);

        return body;

    }

    Update(){

        this.#World.fixedStep();

    }

}
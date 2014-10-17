/// <reference path="../../../config.ts" />
module application {
    export function lightsSrvc($resource: ng.resource.IResourceService): lightResource {
        var lights: lightResource;
        lights = <lightResource>$resource(config.resource.lights);
        return lights;
    }

    export interface light extends ng.resource.IResource<light> {
        name: string
        latitude: number
        longitude: number
    }

    export interface lightResource extends ng.resource.IResourceClass<light> {

    }
} 
declare module 'edge' {
    function func(): (args: Object, callback: (err: Error, result: any) => void) => void;
    function func(dllName: string): (args: Object, callback: (err: Error, result: any) => void) => void;
    function func(option: IFuncOption): (args: Object, callback: (err: Error, result: any) => void) => void;

    interface IFuncOption {
        assemblyFile?: string;
        typeName?: string;
        methodName?: string;
    }
}
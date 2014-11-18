declare module 'edge' {
    function func(): Function;
    function func(dllName: string): Function;
    function func(option: IFuncOption): Function;

    interface IFuncOption {
        assemblyFile?: string;
        typeName?: string;
        methodName?: string;
    }
}
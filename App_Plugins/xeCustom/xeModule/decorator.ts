//@debugLog() decorator - use it on any method to get automatic console.log(in/out) of all method calls
export function debugLog(target: any, propertyKey: string, origvalue: any) {
    return { //redefine value = propertyDescriptor --> to inject logging
        value: function (...args: any[]) {
            var input = args.map(a => JSON.stringify(a)).join(); //get all imput (params passed to method call)
            var result = origvalue.value.apply(this, args); //call original value/method to get the result
            console.log(`LOG> ${propertyKey} ( ${input} ) => ${JSON.stringify(result)}`); //log method (input) -> result
            return result; //return original result - NO modification of original method behaviour, I only added logging!
        }
    }
}
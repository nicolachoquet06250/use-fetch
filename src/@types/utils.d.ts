declare module 'utils' {
    type Omited<T, K extends keyof T> = {
        [ key in keyof T as key extends K ? never : key ]: 
            (T[key] extends string 
                ? string : T[key] extends number 
                    ? number : T[key] extends boolean 
                        ? boolean : never);
    };

    type Optionals<T, P extends keyof T> = {
        [K in P]?: T[K]
    };

    type Combine<T> = { [K in keyof T]: T[K] };
}